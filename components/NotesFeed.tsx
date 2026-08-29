"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  FileText,
  LogOut,
  Maximize2,
  MessageCircle,
  Paperclip,
  Pencil,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  deriveNoteKind,
  initialNotes,
  normalizeNote,
  normalizeNoteComment,
  type NoteComment,
  type NoteAttachment,
  type NoteAttachmentKind,
  type NoteMediaType,
  type NotePost,
} from "@/lib/notes";

type AccessState = "checking" | "editor" | "public";
type ViewerMedia = { index: number; items: string[]; type: NoteMediaType };

const MAX_ATTACHMENTS = 6;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;
const MAX_DOCUMENT_BYTES = 25 * 1024 * 1024;
const ATTACHMENT_ACCEPT = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "application/pdf",
  ".doc",
  ".docx",
  ".txt",
  ".md",
  ".csv",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",
].join(",");

export function NotesFeed() {
  const client = getSupabaseBrowserClient();
  const [access, setAccess] = useState<AccessState>(
    client ? "checking" : "public",
  );
  const [user, setUser] = useState<User | null>(null);
  const [notes, setNotes] = useState<NotePost[]>(client ? [] : initialNotes);
  const [comments, setComments] = useState<NoteComment[]>([]);
  const [editingNote, setEditingNote] = useState<NotePost | null>(null);
  const [deletingNote, setDeletingNote] = useState<NotePost | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewer, setViewer] = useState<ViewerMedia | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(client));
  const [loadError, setLoadError] = useState("");

  const loadNotes = useCallback(async () => {
    if (!client) return;

    setIsLoading(true);
    setLoadError("");
    const [notesResult, commentsResult] = await Promise.all([
      client
        .from("notes")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false }),
      client.from("note_comments").select("*").order("created_at"),
    ]);

    if (notesResult.error || commentsResult.error) {
      setLoadError("The feed could not be loaded. Please try again.");
    } else {
      setNotes((notesResult.data ?? []).map((row) => normalizeNote(row)));
      setComments(
        (commentsResult.data ?? []).map((row) => normalizeNoteComment(row)),
      );
    }
    setIsLoading(false);
  }, [client]);

  const checkAccess = useCallback(
    async (nextUser?: User | null) => {
      if (!client) {
        setAccess("public");
        setUser(null);
        return;
      }

      const resolvedUser =
        nextUser === undefined
          ? (await client.auth.getUser()).data.user
          : nextUser;
      setUser(resolvedUser);

      if (!resolvedUser) {
        setAccess("public");
        return;
      }

      const { data } = await client
        .from("site_editors")
        .select("user_id")
        .eq("user_id", resolvedUser.id)
        .maybeSingle();
      setAccess(data ? "editor" : "public");
    },
    [client],
  );

  useEffect(() => {
    void loadNotes();
  }, [loadNotes]);

  useEffect(() => {
    if (!client) return;

    void checkAccess();
    const { data } = client.auth.onAuthStateChange((_event, session) => {
      window.setTimeout(() => void checkAccess(session?.user ?? null), 0);
    });
    return () => data.subscription.unsubscribe();
  }, [checkAccess, client]);

  useEffect(() => {
    if (!viewer && !deletingNote) return;

    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setViewer(null);
        setDeletingNote(null);
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [deletingNote, viewer]);

  function mergeSavedNote(note: NotePost) {
    setNotes((current) =>
      [note, ...current.filter((item) => item.id !== note.id)].sort(
        (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
      ),
    );
    setEditingNote(null);
  }

  function mergeSavedComment(comment: NoteComment) {
    setComments((current) =>
      [...current.filter((item) => item.id !== comment.id), comment].sort(
        (a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt),
      ),
    );
  }

  async function deleteComment(comment: NoteComment) {
    if (!client || access !== "editor") return;

    const { error } = await client
      .from("note_comments")
      .delete()
      .eq("id", comment.id);
    if (error) {
      setLoadError("That reply could not be deleted. Please try again.");
      return;
    }
    await removeStoredMedia(
      client,
      comment.attachments.map((attachment) => attachment.url),
    );
    setComments((current) => current.filter((item) => item.id !== comment.id));
  }

  async function deleteNote(note: NotePost) {
    if (!client || access !== "editor") return;

    setIsDeleting(true);
    const { error } = await client.from("notes").delete().eq("id", note.id);
    if (error) {
      setLoadError("That post could not be deleted. Please try again.");
      setIsDeleting(false);
      return;
    }

    const commentAttachmentUrls = comments
      .filter((comment) => comment.noteId === note.id)
      .flatMap((comment) =>
        comment.attachments.map((attachment) => attachment.url),
      );
    await removeStoredMedia(client, [
      ...note.attachments.map((attachment) => attachment.url),
      ...commentAttachmentUrls,
    ]);
    setNotes((current) => current.filter((item) => item.id !== note.id));
    setComments((current) =>
      current.filter((comment) => comment.noteId !== note.id),
    );
    setDeletingNote(null);
    setIsDeleting(false);
    if (editingNote?.id === note.id) setEditingNote(null);
  }

  return (
    <article className="content-view-enter mx-auto min-h-screen w-full max-w-[960px] px-6 pb-20 pt-16 sm:px-10 sm:pt-20 lg:px-12">
      <header className="border-b border-white/10 pb-7 text-left">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-200/65">
              Posts, media, and links
            </p>
            <h1 className="mt-3 text-4xl font-semibold text-stone-50 sm:text-5xl">
              Feed
            </h1>
          </div>
          {access === "editor" && client ? (
            <button
              aria-label="Sign out of publishing"
              className={iconButtonClassName}
              onClick={() => void client.auth.signOut()}
              title="Sign out of publishing"
              type="button"
            >
              <LogOut className="h-4 w-4" />
            </button>
          ) : null}
        </div>
        <p className="mt-4 max-w-2xl text-base leading-8 text-stone-400 sm:text-lg">
          Short thoughts, shared media, useful links, and project updates that
          do not need an entire chapter.
        </p>
      </header>

      {access === "editor" && client && user ? (
        <FeedComposer
          client={client}
          editingNote={editingNote}
          key={editingNote?.id ?? "new-post"}
          onCancel={() => setEditingNote(null)}
          onSaved={mergeSavedNote}
          user={user}
        />
      ) : access === "checking" ? (
        <div className="mt-6 h-20 animate-pulse rounded-lg border border-white/10 bg-white/[0.025]" />
      ) : null}

      {loadError ? (
        <div className="mt-6 flex items-center justify-between gap-4 rounded-lg border border-red-300/15 bg-red-300/[0.04] px-4 py-3 text-sm text-stone-300">
          <span>{loadError}</span>
          <button
            className="inline-flex shrink-0 items-center gap-2 text-amber-100 hover:text-amber-50"
            onClick={() => void loadNotes()}
            type="button"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </button>
        </div>
      ) : null}

      <section aria-busy={isLoading} aria-label="Feed posts" className="mt-6">
        {isLoading ? (
          <FeedSkeleton />
        ) : notes.length ? (
          <div className="divide-y divide-white/10 border-t border-white/10">
            {notes.map((note) => (
              <NoteEntry
                canManage={access === "editor"}
                client={client}
                comments={comments.filter(
                  (comment) => comment.noteId === note.id,
                )}
                key={note.id}
                note={note}
                onCommentDelete={(comment) => void deleteComment(comment)}
                onCommentSaved={mergeSavedComment}
                onDelete={setDeletingNote}
                onEdit={setEditingNote}
                onOpenMedia={setViewer}
                user={user}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-white/10 px-6 py-16 text-center">
            <p className="text-sm text-stone-400">
              Nothing has been published here yet.
            </p>
          </div>
        )}
      </section>

      {viewer ? (
        <MediaViewer
          media={viewer}
          onChange={setViewer}
          onClose={() => setViewer(null)}
        />
      ) : null}
      {deletingNote ? (
        <ConfirmDelete
          isDeleting={isDeleting}
          note={deletingNote}
          onCancel={() => setDeletingNote(null)}
          onConfirm={() => void deleteNote(deletingNote)}
        />
      ) : null}
    </article>
  );
}

function FeedComposer({
  client,
  editingNote,
  onCancel,
  onSaved,
  user,
}: {
  client: SupabaseClient;
  editingNote: NotePost | null;
  onCancel: () => void;
  onSaved: (note: NotePost) => void;
  user: User;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [body, setBody] = useState(editingNote?.body ?? "");
  const [existingAttachments, setExistingAttachments] = useState(
    editingNote?.attachments ?? [],
  );
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const previews = useMemo(
    () =>
      files.map((file) => attachmentFromFile(file, URL.createObjectURL(file))),
    [files],
  );

  useEffect(
    () => () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    },
    [previews],
  );

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(Math.max(textarea.scrollHeight, 44), 224)}px`;
  }, [body]);

  function chooseFiles(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!selected.length) return;

    const validation = validateAttachmentSelection(
      selected,
      existingAttachments.length + files.length,
      [...existingAttachments, ...previews],
    );
    if (validation) {
      setStatus(validation);
      return;
    }

    setFiles((current) => [...current, ...selected]);
    setStatus("");
  }

  function removeExistingAttachment(url: string) {
    setExistingAttachments((current) =>
      current.filter((item) => item.url !== url),
    );
  }

  function removePreview(index: number) {
    setFiles((current) =>
      current.filter((_, itemIndex) => itemIndex !== index),
    );
  }

  async function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSaving) return;

    const cleanBody = body.trim();
    const bodySourceUrl = findFirstHttpUrl(cleanBody);
    const resolvedSourceUrl = bodySourceUrl ?? editingNote?.sourceUrl ?? null;
    if (
      !cleanBody &&
      !resolvedSourceUrl &&
      !existingAttachments.length &&
      !files.length
    ) {
      setStatus("Add a thought, link, or attachment before publishing.");
      return;
    }

    setIsSaving(true);
    setStatus(
      files.length
        ? `Uploading ${files.length} file${files.length === 1 ? "" : "s"}...`
        : "Publishing...",
    );
    const uploadedAttachments: NoteAttachment[] = [];

    try {
      for (const file of files) {
        const extension = safeFileExtension(file);
        const path = `${user.id}/${crypto.randomUUID()}.${extension}`;
        const { error } = await client.storage
          .from("notes-media")
          .upload(path, file, {
            cacheControl: "3600",
            contentType: resolvedMimeType(file),
            upsert: false,
          });
        if (error) throw error;
        uploadedAttachments.push(
          attachmentFromFile(
            file,
            client.storage.from("notes-media").getPublicUrl(path).data
              .publicUrl,
          ),
        );
      }

      const attachments = [...existingAttachments, ...uploadedAttachments];
      const visualAttachments = attachments.filter(
        (attachment) =>
          attachment.kind === "image" || attachment.kind === "video",
      );
      const visualKinds = new Set(
        visualAttachments.map((attachment) => attachment.kind),
      );
      const mediaType =
        visualKinds.size === 1
          ? (visualAttachments[0]?.kind as NoteMediaType | undefined)
          : undefined;
      const mediaUrls = visualAttachments.map((attachment) => attachment.url);
      const now = new Date().toISOString();
      const payload = {
        attachments,
        author_id: user.id,
        body: cleanBody,
        kind: deriveNoteKind({ mediaType, sourceUrl: resolvedSourceUrl }),
        media_type: mediaType ?? null,
        media_url: mediaUrls[0] ?? null,
        media_urls: mediaUrls,
        published: true,
        published_at: editingNote?.publishedAt ?? now,
        source_label: editingNote?.sourceLabel ?? null,
        source_url: resolvedSourceUrl,
        title: editingNote?.title ?? null,
        updated_at: now,
      };

      const query = editingNote
        ? client.from("notes").update(payload).eq("id", editingNote.id)
        : client.from("notes").insert(payload);
      const { data, error } = await query.select("*").single();
      if (error) throw error;

      if (editingNote) {
        const removedUrls = editingNote.attachments
          .filter(
            (attachment) =>
              !attachments.some((item) => item.url === attachment.url),
          )
          .map((attachment) => attachment.url);
        await removeStoredMedia(client, removedUrls);
      }
      onSaved(normalizeNote(data));
      setBody("");
      setExistingAttachments([]);
      setFiles([]);
      setStatus("");
    } catch (error) {
      await removeStoredMedia(
        client,
        uploadedAttachments.map((attachment) => attachment.url),
      );
      setStatus(toFriendlySaveError(error));
    } finally {
      setIsSaving(false);
    }
  }

  const allAttachments = [...existingAttachments, ...previews];
  const hasPublishableContent = Boolean(
    body.trim() || existingAttachments.length || files.length,
  );

  return (
    <form
      className="mt-6 rounded-lg border border-white/10 bg-white/[0.012] px-4 py-3 transition focus-within:border-amber-200/20"
      onSubmit={publish}
    >
      <textarea
        aria-label="Post text"
        className="block min-h-11 max-h-56 w-full resize-none overflow-y-auto bg-transparent px-1 py-2 text-sm leading-6 text-stone-100 outline-none placeholder:text-stone-600 sm:text-[15px] sm:leading-7"
        maxLength={12000}
        onChange={(event) => setBody(event.target.value)}
        placeholder="What are you thinking?"
        ref={textareaRef}
        rows={1}
        value={body}
      />

      {allAttachments.length ? (
        <AttachmentPreviewGrid
          attachments={allAttachments}
          existingCount={existingAttachments.length}
          onRemoveExisting={removeExistingAttachment}
          onRemovePreview={removePreview}
        />
      ) : null}

      <div className="mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] pt-3">
        <div className="flex items-center gap-2">
          <button
            aria-label="Attach media or a document"
            className={composerActionClassName}
            onClick={() => fileInputRef.current?.click()}
            title="Attach media or a document"
            type="button"
          >
            <Paperclip className="h-4 w-4" />
          </button>
          <input
            accept={ATTACHMENT_ACCEPT}
            className="sr-only"
            multiple
            onChange={chooseFiles}
            ref={fileInputRef}
            type="file"
          />
          {editingNote ? (
            <button
              className="h-9 px-2 text-xs text-stone-500 hover:text-stone-200"
              onClick={onCancel}
              type="button"
            >
              Cancel
            </button>
          ) : null}
        </div>
        <button
          className="inline-flex h-9 items-center rounded-full bg-amber-100 px-5 text-xs font-semibold text-stone-950 transition-colors hover:bg-amber-300 disabled:cursor-default disabled:bg-stone-600 disabled:text-stone-200 disabled:hover:bg-stone-600"
          disabled={isSaving || !hasPublishableContent}
          type="submit"
        >
          {isSaving
            ? editingNote
              ? "Updating..."
              : "Posting..."
            : editingNote
              ? "Update"
              : "Post"}
        </button>
      </div>

      {status ? (
        <p aria-live="polite" className="mt-3 text-xs leading-5 text-stone-400">
          {status}
        </p>
      ) : null}
    </form>
  );
}

function NoteEntry({
  canManage,
  client,
  comments,
  note,
  onCommentDelete,
  onCommentSaved,
  onDelete,
  onEdit,
  onOpenMedia,
  user,
}: {
  canManage: boolean;
  client: SupabaseClient | null;
  comments: NoteComment[];
  note: NotePost;
  onCommentDelete: (comment: NoteComment) => void;
  onCommentSaved: (comment: NoteComment) => void;
  onDelete: (note: NotePost) => void;
  onEdit: (note: NotePost) => void;
  onOpenMedia: (media: ViewerMedia) => void;
  user: User | null;
}) {
  const [isReplying, setIsReplying] = useState(false);
  const wasEdited = Boolean(
    note.updatedAt &&
    note.createdAt &&
    Date.parse(note.updatedAt) - Date.parse(note.createdAt) > 1000,
  );
  const embeddedUrl = note.sourceUrl ?? findFirstHttpUrl(note.body);
  const displayedBody = embeddedUrl
    ? removeDisplayedSourceUrl(note.body, embeddedUrl)
    : note.body;

  return (
    <article className="py-7 sm:py-8">
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-full border border-amber-200/25 bg-[#181611] font-mono text-[10px] text-amber-100">
            DL
          </div>
          <div>
            <p className="text-sm font-medium text-stone-100">
              Daniel Lezhanskiy
            </p>
            <p className="mt-0.5 text-xs text-stone-500">
              <time dateTime={note.publishedAt}>
                {formatNoteDate(note.publishedAt)}
              </time>
              {wasEdited ? " · Edited" : ""}
            </p>
          </div>
        </div>
        {canManage ? (
          <div className="flex gap-1">
            <button
              aria-label={isReplying ? "Hide reply box" : "Reply to post"}
              aria-pressed={isReplying}
              className={`${iconButtonClassName} relative ${
                isReplying
                  ? "border-amber-200/45 bg-amber-100/[0.1] text-amber-100 shadow-[0_0_18px_rgba(253,230,138,0.08)]"
                  : ""
              }`}
              onClick={() => setIsReplying((current) => !current)}
              title={isReplying ? "Hide reply box" : "Reply to post"}
              type="button"
            >
              {isReplying ? (
                <X className="h-4 w-4" />
              ) : (
                <MessageCircle className="h-4 w-4" />
              )}
              {comments.length ? (
                <span className="absolute -right-1 -top-1 grid min-h-4 min-w-4 place-items-center rounded-full bg-amber-100 px-1 text-[9px] font-semibold text-stone-950">
                  {comments.length}
                </span>
              ) : null}
            </button>
            <button
              aria-label="Edit post"
              className={iconButtonClassName}
              onClick={() => onEdit(note)}
              title="Edit post"
              type="button"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              aria-label="Delete post"
              className={`${iconButtonClassName} hover:text-red-300`}
              onClick={() => onDelete(note)}
              title="Delete post"
              type="button"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ) : null}
      </header>

      {note.title ? (
        <h2 className="mt-5 text-xl font-semibold leading-7 text-stone-50 sm:text-2xl">
          {note.title}
        </h2>
      ) : null}
      {displayedBody ? <PostBody body={displayedBody} /> : null}

      {note.attachments.length ? (
        <AttachmentGallery
          attachments={note.attachments}
          onOpenMedia={onOpenMedia}
          title={note.title}
        />
      ) : null}

      {embeddedUrl ? (
        <div className="mt-5">
          <ExternalContent label={note.sourceLabel} url={embeddedUrl} />
        </div>
      ) : null}

      {isReplying && canManage && client && user ? (
        <ReplyComposer
          client={client}
          noteId={note.id}
          onSaved={(comment) => {
            onCommentSaved(comment);
            setIsReplying(false);
          }}
          user={user}
        />
      ) : null}

      {comments.length ? (
        <CommentList
          canManage={canManage}
          comments={comments}
          onOpenMedia={onOpenMedia}
          onDelete={onCommentDelete}
        />
      ) : null}
    </article>
  );
}

function ReplyComposer({
  client,
  noteId,
  onSaved,
  user,
}: {
  client: SupabaseClient;
  noteId: string;
  onSaved: (comment: NoteComment) => void;
  user: User;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [body, setBody] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const previews = useMemo(
    () =>
      files.map((file) => attachmentFromFile(file, URL.createObjectURL(file))),
    [files],
  );

  useEffect(
    () => () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    },
    [previews],
  );

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(Math.max(textarea.scrollHeight, 40), 160)}px`;
  }, [body]);

  function chooseFiles(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!selected.length) return;

    const validation = validateAttachmentSelection(
      selected,
      files.length,
      previews,
    );
    if (validation) {
      setStatus(validation);
      return;
    }

    setFiles((current) => [...current, ...selected]);
    setStatus("");
  }

  async function publishReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanBody = body.trim();
    if ((!cleanBody && !files.length) || isSaving) return;

    setIsSaving(true);
    setStatus(
      files.length
        ? `Uploading ${files.length} file${files.length === 1 ? "" : "s"}...`
        : "Replying...",
    );
    const uploadedAttachments: NoteAttachment[] = [];

    try {
      for (const file of files) {
        const extension = safeFileExtension(file);
        const path = `${user.id}/${crypto.randomUUID()}.${extension}`;
        const { error } = await client.storage
          .from("notes-media")
          .upload(path, file, {
            cacheControl: "3600",
            contentType: resolvedMimeType(file),
            upsert: false,
          });
        if (error) throw error;
        uploadedAttachments.push(
          attachmentFromFile(
            file,
            client.storage.from("notes-media").getPublicUrl(path).data
              .publicUrl,
          ),
        );
      }

      const { data, error } = await client
        .from("note_comments")
        .insert({
          attachments: uploadedAttachments,
          author_id: user.id,
          body: cleanBody,
          note_id: noteId,
        })
        .select("*")
        .single();
      if (error) throw error;

      setBody("");
      setFiles([]);
      setStatus("");
      onSaved(normalizeNoteComment(data));
    } catch (error) {
      await removeStoredMedia(
        client,
        uploadedAttachments.map((attachment) => attachment.url),
      );
      setStatus(toFriendlyReplyError(error));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      className="mt-5 rounded-lg border border-white/10 bg-white/[0.012] px-4 py-3 transition focus-within:border-amber-200/20"
      onSubmit={publishReply}
    >
      <textarea
        aria-label="Reply text"
        className="block min-h-10 max-h-40 w-full resize-none overflow-y-auto bg-transparent px-1 py-2 text-sm leading-6 text-stone-100 outline-none placeholder:text-stone-600"
        maxLength={3000}
        onChange={(event) => setBody(event.target.value)}
        placeholder="Write a reply..."
        ref={textareaRef}
        rows={1}
        value={body}
      />
      {previews.length ? (
        <AttachmentPreviewGrid
          attachments={previews}
          existingCount={0}
          onRemoveExisting={() => undefined}
          onRemovePreview={(index) =>
            setFiles((current) =>
              current.filter((_, itemIndex) => itemIndex !== index),
            )
          }
        />
      ) : null}
      <div className="mt-2 flex items-center justify-between border-t border-white/[0.08] pt-3">
        <button
          aria-label="Attach media or a document to this reply"
          className={composerActionClassName}
          onClick={() => fileInputRef.current?.click()}
          title="Attach media or a document"
          type="button"
        >
          <Paperclip className="h-4 w-4" />
        </button>
        <input
          accept={ATTACHMENT_ACCEPT}
          className="sr-only"
          multiple
          onChange={chooseFiles}
          ref={fileInputRef}
          type="file"
        />
        <button
          className="inline-flex h-8 items-center rounded-full bg-amber-100 px-4 text-xs font-semibold text-stone-950 transition-colors hover:bg-amber-300 disabled:cursor-default disabled:bg-stone-600 disabled:text-stone-200 disabled:hover:bg-stone-600"
          disabled={(!body.trim() && !files.length) || isSaving}
          type="submit"
        >
          {isSaving ? "Replying..." : "Reply"}
        </button>
      </div>
      {status ? (
        <p aria-live="polite" className="mt-2 text-xs text-stone-400">
          {status}
        </p>
      ) : null}
    </form>
  );
}

function CommentList({
  canManage,
  comments,
  onDelete,
  onOpenMedia,
}: {
  canManage: boolean;
  comments: NoteComment[];
  onDelete: (comment: NoteComment) => void;
  onOpenMedia: (media: ViewerMedia) => void;
}) {
  return (
    <section
      aria-label={`${comments.length} ${comments.length === 1 ? "reply" : "replies"}`}
      className="mt-5 border-l border-amber-200/20 pl-4 sm:pl-5"
    >
      {comments.map((comment) => (
        <article
          className="border-t border-white/[0.08] py-4 first:border-t-0 first:pt-1"
          key={comment.id}
        >
          <header className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-stone-200">
                Daniel Lezhanskiy
              </p>
              <time
                className="mt-1 block text-[11px] text-stone-600"
                dateTime={comment.createdAt}
              >
                {formatNoteDate(comment.createdAt)}
              </time>
            </div>
            {canManage ? (
              <button
                aria-label="Delete reply"
                className="grid h-7 w-7 place-items-center rounded-md text-stone-600 transition hover:bg-white/[0.04] hover:text-red-300"
                onClick={() => onDelete(comment)}
                title="Delete reply"
                type="button"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </header>
          {comment.body ? <PostBody body={comment.body} compact /> : null}
          {comment.attachments.length ? (
            <AttachmentGallery
              attachments={comment.attachments}
              compact
              onOpenMedia={onOpenMedia}
            />
          ) : null}
        </article>
      ))}
    </section>
  );
}

function PostBody({
  body,
  compact = false,
}: {
  body: string;
  compact?: boolean;
}) {
  const content: ReactNode[] = [];
  let cursor = 0;

  for (const match of body.matchAll(/https?:\/\/[^\s<>"']+/gi)) {
    const start = match.index ?? 0;
    const rawUrl = match[0];
    const { trailing, url } = cleanMatchedUrl(rawUrl);
    content.push(body.slice(cursor, start));
    content.push(
      <a
        className="break-all text-amber-200/85 underline decoration-amber-200/30 underline-offset-4 transition hover:text-amber-100"
        href={url}
        key={`${start}:${url}`}
        rel="noreferrer"
        target="_blank"
      >
        {url}
      </a>,
    );
    if (trailing) content.push(trailing);
    cursor = start + rawUrl.length;
  }

  content.push(body.slice(cursor));

  return (
    <p
      className={
        compact
          ? "mt-2 whitespace-pre-wrap text-sm leading-6 text-stone-300"
          : "mt-4 whitespace-pre-wrap text-sm leading-7 text-stone-300 sm:text-[15px] sm:leading-7"
      }
    >
      {content}
    </p>
  );
}

function removeDisplayedSourceUrl(body: string, sourceUrl: string) {
  const target = comparableUrl(sourceUrl);
  if (!target) return body;

  return body
    .replace(/https?:\/\/[^\s<>"']+/gi, (rawUrl) => {
      const { trailing, url } = cleanMatchedUrl(rawUrl);
      return comparableUrl(url) === target ? trailing : rawUrl;
    })
    .replace(/^[\t ]*\n+/, "")
    .replace(/\n+[\t ]*$/, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function comparableUrl(value: string) {
  try {
    const url = new URL(value);
    url.hash = "";
    url.pathname = url.pathname.replace(/\/+$/, "") || "/";
    return url.toString();
  } catch {
    return null;
  }
}

function AttachmentPreviewGrid({
  attachments,
  existingCount,
  onRemoveExisting,
  onRemovePreview,
}: {
  attachments: NoteAttachment[];
  existingCount: number;
  onRemoveExisting: (url: string) => void;
  onRemovePreview: (index: number) => void;
}) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
      {attachments.map((attachment, index) => (
        <div
          className="group relative min-h-28 overflow-hidden rounded-md border border-white/10 bg-black/25"
          key={`${attachment.url}:${index}`}
        >
          {attachment.kind === "image" ? (
            <img
              alt={attachment.name}
              className="aspect-[4/3] h-full w-full object-contain"
              src={attachment.url}
            />
          ) : attachment.kind === "video" ? (
            <video
              className="aspect-[4/3] h-full w-full object-contain"
              muted
              playsInline
              preload="metadata"
              src={attachment.url}
            />
          ) : (
            <div className="flex h-full min-h-28 items-center gap-3 p-4 pr-10">
              <FileText className="h-7 w-7 shrink-0 text-amber-200/65" />
              <div className="min-w-0">
                <p className="line-clamp-2 break-words text-xs font-medium leading-5 text-stone-200">
                  {attachment.name}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-stone-600">
                  {attachmentLabel(attachment)}
                </p>
              </div>
            </div>
          )}
          <button
            aria-label={`Remove ${attachment.name}`}
            className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/75 text-stone-100 backdrop-blur hover:bg-black"
            onClick={() =>
              index < existingCount
                ? onRemoveExisting(attachment.url)
                : onRemovePreview(index - existingCount)
            }
            type="button"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

function AttachmentGallery({
  attachments,
  compact = false,
  onOpenMedia,
  title,
}: {
  attachments: NoteAttachment[];
  compact?: boolean;
  onOpenMedia: (media: ViewerMedia) => void;
  title?: string | null;
}) {
  const images = attachments.filter(
    (attachment) => attachment.kind === "image",
  );
  const videos = attachments.filter(
    (attachment) => attachment.kind === "video",
  );
  const files = attachments.filter(
    (attachment) => attachment.kind === "pdf" || attachment.kind === "file",
  );

  return (
    <div className={compact ? "mt-3" : undefined}>
      {images.length ? (
        <PostMedia
          compact={compact}
          mediaType="image"
          onOpen={(index) =>
            onOpenMedia({
              index,
              items: images.map((attachment) => attachment.url),
              type: "image",
            })
          }
          title={title}
          urls={images.map((attachment) => attachment.url)}
        />
      ) : null}
      {videos.map((attachment) => (
        <PostMedia
          compact={compact}
          key={attachment.url}
          mediaType="video"
          onOpen={() =>
            onOpenMedia({ index: 0, items: [attachment.url], type: "video" })
          }
          title={title}
          urls={[attachment.url]}
        />
      ))}
      {files.map((attachment) => (
        <FileAttachment
          attachment={attachment}
          compact={compact}
          key={attachment.url}
        />
      ))}
    </div>
  );
}

function FileAttachment({
  attachment,
  compact,
}: {
  attachment: NoteAttachment;
  compact: boolean;
}) {
  if (attachment.kind === "pdf" && !compact) {
    return (
      <div className="mt-5 overflow-hidden rounded-lg border border-white/10 bg-black/20">
        <iframe
          className="hidden h-[520px] w-full bg-stone-100 sm:block"
          loading="lazy"
          src={`${attachment.url}#toolbar=1&navpanes=0`}
          title={attachment.name}
        />
        <FileAttachmentCard attachment={attachment} embedded />
      </div>
    );
  }

  return <FileAttachmentCard attachment={attachment} compact={compact} />;
}

function FileAttachmentCard({
  attachment,
  compact = false,
  embedded = false,
}: {
  attachment: NoteAttachment;
  compact?: boolean;
  embedded?: boolean;
}) {
  return (
    <div
      className={`${embedded ? "border-t" : compact ? "mt-3 rounded-md border" : "mt-5 rounded-lg border"} flex min-w-0 items-center gap-3 border-white/10 bg-white/[0.025] p-3 sm:p-4`}
    >
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-amber-200/15 bg-amber-100/[0.04] text-amber-200/70">
        <FileText className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-stone-200">
          {attachment.name}
        </p>
        <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-stone-600">
          {attachmentLabel(attachment)}
          {attachment.size ? ` · ${formatFileSize(attachment.size)}` : ""}
        </p>
      </div>
      <a
        aria-label={`Open ${attachment.name}`}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-white/10 text-stone-500 transition hover:border-amber-200/25 hover:text-amber-100"
        href={attachment.url}
        rel="noreferrer"
        target="_blank"
        title="Open file"
      >
        <ExternalLink className="h-4 w-4" />
      </a>
      <a
        aria-label={`Download ${attachment.name}`}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-white/10 text-stone-500 transition hover:border-amber-200/25 hover:text-amber-100"
        download={attachment.name}
        href={attachment.url}
        title="Download file"
      >
        <Download className="h-4 w-4" />
      </a>
    </div>
  );
}

function PostMedia({
  compact = false,
  mediaType,
  onOpen,
  title,
  urls,
}: {
  compact?: boolean;
  mediaType: NoteMediaType;
  onOpen: (index: number) => void;
  title?: string | null;
  urls: string[];
}) {
  if (mediaType === "video") {
    return (
      <div
        className={`${compact ? "mt-3" : "mt-5"} relative overflow-hidden rounded-lg border border-white/10 bg-black/30`}
      >
        <video
          className={`${compact ? "max-h-80" : "max-h-[620px]"} w-full object-contain`}
          controls
          playsInline
          preload="metadata"
          src={urls[0]}
        />
        <button
          aria-label="Open video viewer"
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-md bg-black/70 text-white backdrop-blur hover:bg-black"
          onClick={() => onOpen(0)}
          title="Expand video"
          type="button"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`${compact ? "mt-3" : "mt-5"} ${urls.length === 1 ? "" : "grid grid-cols-2 gap-2"}`}
    >
      {urls.map((url, index) => (
        <button
          className="block w-full cursor-zoom-in overflow-hidden rounded-lg border border-white/10 bg-black/20"
          key={url}
          onClick={() => onOpen(index)}
          type="button"
        >
          <img
            alt={
              title ? `${title}, image ${index + 1}` : `Post image ${index + 1}`
            }
            className={
              urls.length === 1
                ? `${compact ? "max-h-80" : "max-h-[680px]"} w-full object-contain`
                : "aspect-square w-full object-contain"
            }
            loading="lazy"
            src={url}
          />
        </button>
      ))}
    </div>
  );
}

function ExternalContent({
  label,
  url,
}: {
  label?: string | null;
  url: string;
}) {
  const embed = getExternalEmbed(url);
  const [isExpanded, setIsExpanded] = useState(false);

  if (embed?.provider === "youtube" || embed?.provider === "vimeo") {
    return (
      <>
        <div className="relative overflow-hidden rounded-lg border border-white/10 bg-black/25">
          <div className="aspect-video">
            <iframe
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="h-full w-full"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              src={embed.embedUrl}
              title={`${embed.provider} content`}
            />
          </div>
          <ExpandEmbedButton onClick={() => setIsExpanded(true)} />
          <SourceFooter
            label={label ?? providerLabel(embed.provider)}
            url={url}
          />
        </div>
        {isExpanded ? (
          <ExternalEmbedViewer
            embed={embed}
            onClose={() => setIsExpanded(false)}
            sourceUrl={url}
          />
        ) : null}
      </>
    );
  }

  if (embed?.provider === "instagram") {
    return (
      <InstagramContent
        embed={embed}
        isExpanded={isExpanded}
        label={label}
        onClose={() => setIsExpanded(false)}
        onExpand={() => setIsExpanded(true)}
        url={url}
      />
    );
  }

  return <SourceCard label={label} url={url} />;
}

function InstagramContent({
  embed,
  isExpanded,
  label,
  onClose,
  onExpand,
  url,
}: {
  embed: ExternalEmbed;
  isExpanded: boolean;
  label?: string | null;
  onClose: () => void;
  onExpand: () => void;
  url: string;
}) {
  const [isEmbeddable, setIsEmbeddable] = useState(false);

  useEffect(() => {
    let isCurrent = true;

    fetch(`/api/embed-status?url=${encodeURIComponent(url)}`)
      .then(async (response) => {
        if (!response.ok) return false;
        const result = (await response.json()) as { embeddable?: boolean };
        return result.embeddable === true;
      })
      .catch(() => false)
      .then((nextIsEmbeddable) => {
        if (isCurrent) setIsEmbeddable(nextIsEmbeddable);
      });

    return () => {
      isCurrent = false;
    };
  }, [url]);

  if (!isEmbeddable) {
    return <SourceCard label={label ?? "Open on Instagram"} url={url} />;
  }

  return (
    <>
      <div className="relative overflow-hidden rounded-lg border border-white/10 bg-[#fafafa]">
        <iframe
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="h-[620px] w-full max-w-full bg-white sm:h-[720px]"
          loading="lazy"
          src={embed.embedUrl}
          title="Instagram content"
        />
        <ExpandEmbedButton onClick={onExpand} />
        <SourceFooter label={label ?? "Instagram"} url={url} />
      </div>
      {isExpanded ? (
        <ExternalEmbedViewer embed={embed} onClose={onClose} sourceUrl={url} />
      ) : null}
    </>
  );
}

function ExpandEmbedButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      aria-label="Expand embedded media"
      className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-black/70 text-white shadow-lg backdrop-blur transition hover:bg-black"
      onClick={onClick}
      title="Expand media"
      type="button"
    >
      <Maximize2 className="h-4 w-4" />
    </button>
  );
}

function ExternalEmbedViewer({
  embed,
  onClose,
  sourceUrl,
}: {
  embed: ExternalEmbed;
  onClose: () => void;
  sourceUrl: string;
}) {
  const isInstagram = embed.provider === "instagram";

  return (
    <div
      aria-label="Embedded media viewer"
      aria-modal="true"
      className="fixed inset-0 z-[100] grid place-items-center bg-black/90 p-3 backdrop-blur-sm sm:p-8"
      onClick={onClose}
      role="dialog"
    >
      <button
        aria-label="Close embedded media viewer"
        className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/70 text-white hover:bg-black sm:right-7 sm:top-7"
        onClick={onClose}
        type="button"
      >
        <X className="h-5 w-5" />
      </button>
      <div
        className={
          isInstagram
            ? "h-[92vh] w-full max-w-[680px] overflow-hidden rounded-lg bg-white"
            : "aspect-video w-full max-w-6xl overflow-hidden rounded-lg bg-black"
        }
        onClick={(event) => event.stopPropagation()}
      >
        <iframe
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="h-full w-full"
          src={embed.embedUrl}
          title={`Expanded ${embed.provider} content`}
        />
      </div>
      <a
        className="absolute bottom-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/70 px-4 py-2 text-xs text-stone-200 backdrop-blur hover:text-amber-100 sm:bottom-6"
        href={sourceUrl}
        rel="noreferrer"
        target="_blank"
      >
        Open on {providerLabel(embed.provider)}
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}

function SourceFooter({ label, url }: { label: string; url: string }) {
  return (
    <a
      className="flex items-center justify-between gap-4 border-t border-white/10 bg-[#151411] px-4 py-3 text-xs text-stone-400 hover:text-amber-100"
      href={url}
      rel="noreferrer"
      target="_blank"
    >
      <span className="truncate">{label}</span>
      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
    </a>
  );
}

function SourceCard({ label, url }: { label?: string | null; url: string }) {
  const hostname = safeHostname(url);
  return (
    <a
      className="group flex min-w-0 items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.025] px-4 py-4 transition hover:border-amber-200/25 hover:bg-amber-100/[0.035]"
      href={url}
      rel="noreferrer"
      target="_blank"
    >
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-amber-200/55">
          Shared source
        </p>
        <p className="mt-2 truncate text-sm font-medium text-stone-200">
          {label || hostname}
        </p>
        {label ? (
          <p className="mt-1 truncate text-xs text-stone-500">{hostname}</p>
        ) : null}
      </div>
      <ExternalLink className="h-4 w-4 shrink-0 text-stone-500 transition group-hover:text-amber-100" />
    </a>
  );
}

function MediaViewer({
  media,
  onChange,
  onClose,
}: {
  media: ViewerMedia;
  onChange: (media: ViewerMedia) => void;
  onClose: () => void;
}) {
  const currentUrl = media.items[media.index];
  const hasMultiple = media.items.length > 1;

  return (
    <div
      aria-label="Media viewer"
      aria-modal="true"
      className="fixed inset-0 z-[100] grid place-items-center bg-black/90 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
      role="dialog"
    >
      <button
        aria-label="Close media viewer"
        className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/55 text-white hover:bg-black sm:right-7 sm:top-7"
        onClick={onClose}
        type="button"
      >
        <X className="h-5 w-5" />
      </button>
      {hasMultiple ? (
        <>
          <button
            aria-label="Previous image"
            className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/55 text-white hover:bg-black sm:left-7"
            onClick={(event) => {
              event.stopPropagation();
              onChange({
                ...media,
                index:
                  (media.index - 1 + media.items.length) % media.items.length,
              });
            }}
            type="button"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            aria-label="Next image"
            className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/55 text-white hover:bg-black sm:right-7"
            onClick={(event) => {
              event.stopPropagation();
              onChange({
                ...media,
                index: (media.index + 1) % media.items.length,
              });
            }}
            type="button"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      ) : null}
      <div
        className="max-h-[92vh] max-w-[94vw]"
        onClick={(event) => event.stopPropagation()}
      >
        {media.type === "video" ? (
          <video
            autoPlay
            className="max-h-[90vh] max-w-[92vw] rounded-lg"
            controls
            playsInline
            src={currentUrl}
          />
        ) : (
          <img
            alt="Expanded post media"
            className="max-h-[90vh] max-w-[92vw] rounded-lg object-contain shadow-2xl"
            src={currentUrl}
          />
        )}
      </div>
      {hasMultiple ? (
        <p className="absolute bottom-4 font-mono text-[10px] tracking-[0.16em] text-stone-400">
          {media.index + 1} / {media.items.length}
        </p>
      ) : null}
    </div>
  );
}

function ConfirmDelete({
  isDeleting,
  note,
  onCancel,
  onConfirm,
}: {
  isDeleting: boolean;
  note: NotePost;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-[100] grid place-items-center bg-black/80 p-5 backdrop-blur-sm"
      onClick={onCancel}
      role="dialog"
    >
      <div
        className="w-full max-w-md rounded-lg border border-white/10 bg-[#171612] p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-red-200/70">
          Delete post
        </p>
        <h2 className="mt-3 text-xl font-semibold text-stone-50">
          Remove this post permanently?
        </h2>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-stone-400">
          {note.title || note.body || "Media post"}
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            className="h-10 rounded-md border border-white/10 px-4 text-sm text-stone-300 hover:border-white/20"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
          <button
            className="inline-flex h-10 items-center gap-2 rounded-md bg-red-200 px-4 text-sm font-medium text-red-950 hover:bg-red-100 disabled:opacity-60"
            disabled={isDeleting}
            onClick={onConfirm}
            type="button"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function FeedSkeleton() {
  return (
    <div
      className="divide-y divide-white/10 border-y border-white/10"
      aria-label="Loading posts"
    >
      {[0, 1, 2].map((item) => (
        <div className="animate-pulse py-8" key={item}>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-white/[0.06]" />
            <div>
              <div className="h-3 w-28 rounded bg-white/[0.07]" />
              <div className="mt-2 h-2 w-20 rounded bg-white/[0.04]" />
            </div>
          </div>
          <div className="mt-6 h-3 w-full rounded bg-white/[0.05]" />
          <div className="mt-3 h-3 w-4/5 rounded bg-white/[0.04]" />
        </div>
      ))}
    </div>
  );
}

type ExternalEmbed = {
  embedUrl: string;
  provider: "instagram" | "youtube" | "vimeo";
};

function getExternalEmbed(rawUrl: string): ExternalEmbed | null {
  try {
    const url = new URL(rawUrl);
    const host = url.hostname.replace(/^www\./, "").toLowerCase();

    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id
        ? {
            embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
            provider: "youtube",
          }
        : null;
    }
    if (host.endsWith("youtube.com")) {
      const path = url.pathname.split("/").filter(Boolean);
      const id =
        url.searchParams.get("v") ??
        (path[0] === "shorts" || path[0] === "live" ? path[1] : null);
      return id
        ? {
            embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
            provider: "youtube",
          }
        : null;
    }
    if (host.endsWith("vimeo.com")) {
      const id = url.pathname
        .split("/")
        .filter(Boolean)
        .find((part) => /^\d+$/.test(part));
      return id
        ? {
            embedUrl: `https://player.vimeo.com/video/${id}`,
            provider: "vimeo",
          }
        : null;
    }
    if (host.endsWith("instagram.com")) {
      const parts = url.pathname.split("/").filter(Boolean);
      if (
        (parts[0] === "p" || parts[0] === "reel" || parts[0] === "tv") &&
        parts[1]
      ) {
        return {
          embedUrl: `https://www.instagram.com/${parts[0]}/${parts[1]}/embed/captioned/`,
          provider: "instagram",
        };
      }
    }
  } catch {
    return null;
  }
  return null;
}

function formatNoteDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  const dateLabel = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(date);
  const timeLabel = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
  return `${dateLabel} · ${timeLabel}`;
}

function normalizeHttpUrl(value: string) {
  if (!value.trim()) return null;
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

function cleanMatchedUrl(value: string) {
  const trailing = value.match(/[),.;:!?]+$/)?.[0] ?? "";
  return {
    trailing,
    url: trailing ? value.slice(0, -trailing.length) : value,
  };
}

function findFirstHttpUrl(value: string) {
  const match = value.match(/https?:\/\/[^\s<>"']+/i)?.[0];
  if (!match) return null;
  return normalizeHttpUrl(cleanMatchedUrl(match).url);
}

function safeHostname(value: string) {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return "External source";
  }
}

function providerLabel(provider: ExternalEmbed["provider"]) {
  return provider === "youtube"
    ? "YouTube"
    : provider === "vimeo"
      ? "Vimeo"
      : "Instagram";
}

const MIME_BY_EXTENSION: Record<string, string> = {
  csv: "text/csv",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  gif: "image/gif",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  md: "text/markdown",
  mov: "video/quicktime",
  mp4: "video/mp4",
  pdf: "application/pdf",
  png: "image/png",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  txt: "text/plain",
  webm: "video/webm",
  webp: "image/webp",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

function fileExtension(name: string) {
  return (
    name
      .split(".")
      .pop()
      ?.toLowerCase()
      .replace(/[^a-z0-9]/g, "") ?? ""
  );
}

function resolvedMimeType(file: File) {
  return file.type || MIME_BY_EXTENSION[fileExtension(file.name)] || "";
}

function attachmentKindForFile(file: File): NoteAttachmentKind | null {
  const mimeType = resolvedMimeType(file);
  if (!mimeType) return null;
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType === "application/pdf") return "pdf";
  if (Object.values(MIME_BY_EXTENSION).includes(mimeType)) return "file";
  return null;
}

function attachmentFromFile(file: File, url: string): NoteAttachment {
  return {
    url,
    name: file.name,
    mimeType: resolvedMimeType(file),
    size: file.size,
    kind: attachmentKindForFile(file) ?? "file",
  };
}

function validateAttachmentSelection(
  selected: File[],
  currentCount: number,
  currentAttachments: NoteAttachment[],
) {
  if (currentCount + selected.length > MAX_ATTACHMENTS) {
    return `Attach up to ${MAX_ATTACHMENTS} files to one post or reply.`;
  }

  const unsupported = selected.find((file) => !attachmentKindForFile(file));
  if (unsupported) {
    return `${unsupported.name} is not a supported image, video, PDF, document, text file, presentation, or spreadsheet.`;
  }

  const tooLarge = selected.find((file) => {
    const kind = attachmentKindForFile(file);
    const limit =
      kind === "image"
        ? MAX_IMAGE_BYTES
        : kind === "video"
          ? MAX_VIDEO_BYTES
          : MAX_DOCUMENT_BYTES;
    return file.size > limit;
  });
  if (tooLarge) {
    const kind = attachmentKindForFile(tooLarge);
    return kind === "video"
      ? "Videos must be 50 MB or smaller."
      : kind === "image"
        ? "Each image must be 10 MB or smaller."
        : "Each document must be 25 MB or smaller.";
  }

  const videoCount =
    currentAttachments.filter((attachment) => attachment.kind === "video")
      .length +
    selected.filter((file) => attachmentKindForFile(file) === "video").length;
  if (videoCount > 1) return "Attach one video at a time.";

  return null;
}

function attachmentLabel(attachment: NoteAttachment) {
  if (attachment.kind === "image") return "Image";
  if (attachment.kind === "video") return "Video";
  if (attachment.kind === "pdf") return "PDF";
  return fileExtension(attachment.name).toUpperCase() || "File";
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(bytes < 10 * 1024 * 1024 ? 1 : 0)} MB`;
}

function safeFileExtension(file: File) {
  const fromName = fileExtension(file.name);
  if (fromName) return fromName;
  return resolvedMimeType(file).startsWith("video/") ? "mp4" : "jpg";
}

function storagePathFromPublicUrl(url: string) {
  const marker = "/storage/v1/object/public/notes-media/";
  const index = url.indexOf(marker);
  return index === -1
    ? null
    : decodeURIComponent(url.slice(index + marker.length).split(/[?#]/)[0]);
}

async function removeStoredMedia(client: SupabaseClient, urls: string[]) {
  const paths = Array.from(
    new Set(
      urls
        .map(storagePathFromPublicUrl)
        .filter((path): path is string => Boolean(path)),
    ),
  );
  if (paths.length) await client.storage.from("notes-media").remove(paths);
}

function toFriendlySaveError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error ?? "");
  if (/attachments|media_urls|media_type|schema cache/i.test(message)) {
    return "The Feed database needs the latest schema update before this post can be saved.";
  }
  if (/row-level security|permission|policy/i.test(message)) {
    return "Publishing access was rejected. Check that this account is listed as a site editor.";
  }
  if (/payload too large|maximum allowed size|file size/i.test(message)) {
    return "That media file is larger than the configured upload limit.";
  }
  return "The post could not be published. Your text and selections are still here so you can retry.";
}

function toFriendlyReplyError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error ?? "");
  if (/attachments|schema cache/i.test(message)) {
    return "The Feed database needs the latest attachment update before this reply can be posted.";
  }
  if (/payload too large|maximum allowed size|file size/i.test(message)) {
    return "One of those files is larger than the configured upload limit.";
  }
  return "That reply could not be posted. Your text and attachments are still here.";
}

const iconButtonClassName =
  "grid h-9 w-9 shrink-0 place-items-center rounded-md border border-white/10 text-stone-500 transition hover:border-amber-200/25 hover:text-amber-100";
const composerActionClassName =
  "grid h-9 w-9 shrink-0 place-items-center rounded-full text-stone-500 transition hover:bg-amber-100/[0.07] hover:text-amber-100 aria-pressed:bg-amber-100/[0.08] aria-pressed:text-amber-100";
