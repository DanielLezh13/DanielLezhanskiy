"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { ArrowLeft, ExternalLink, ImagePlus, LogOut, Pencil, Plus, Trash2 } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient, hasSupabaseConfig } from "@/lib/supabase/client";
import type { NoteKind } from "@/lib/notes";

type StudioPost = {
  id: string;
  kind: NoteKind;
  title: string | null;
  body: string;
  source_label: string | null;
  source_url: string | null;
  media_url: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
};

type EditorForm = {
  kind: NoteKind;
  title: string;
  body: string;
  sourceLabel: string;
  sourceUrl: string;
  mediaUrl: string;
  published: boolean;
};

const emptyForm: EditorForm = {
  kind: "thought",
  title: "",
  body: "",
  sourceLabel: "",
  sourceUrl: "",
  mediaUrl: "",
  published: true,
};

const kinds: { id: NoteKind; label: string }[] = [
  { id: "thought", label: "Thought" },
  { id: "link", label: "Link" },
  { id: "image", label: "Image" },
  { id: "video", label: "Video" },
];

export default function StudioPage() {
  const configured = hasSupabaseConfig();
  const client = getSupabaseBrowserClient();
  const [user, setUser] = useState<User | null>(null);
  const [isEditor, setIsEditor] = useState(false);
  const [isChecking, setIsChecking] = useState(configured);
  const [posts, setPosts] = useState<StudioPost[]>([]);
  const [form, setForm] = useState<EditorForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [upload, setUpload] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const loadEditor = useCallback(async (nextUser: User | null) => {
    if (!client || !nextUser) {
      setIsEditor(false);
      setPosts([]);
      setIsChecking(false);
      return;
    }

    setIsChecking(true);
    const { data: editor } = await client
      .from("site_editors")
      .select("user_id")
      .eq("user_id", nextUser.id)
      .maybeSingle();

    const allowed = Boolean(editor);
    setIsEditor(allowed);

    if (allowed) {
      const { data } = await client
        .from("notes")
        .select("*")
        .order("created_at", { ascending: false });
      setPosts((data ?? []) as StudioPost[]);
    }

    setIsChecking(false);
  }, [client]);

  useEffect(() => {
    if (!client) {
      return;
    }

    client.auth.getUser().then(({ data }) => {
      setUser(data.user);
      void loadEditor(data.user);
    });

    const { data } = client.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      void loadEditor(session?.user ?? null);
    });

    return () => data.subscription.unsubscribe();
  }, [client, loadEditor]);

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!client || !user || !isEditor || !form.body.trim()) {
      return;
    }

    setIsSaving(true);
    setStatus("");

    const wasEditing = Boolean(editingId);

    try {
      let mediaUrl = form.mediaUrl.trim() || null;

      if (upload) {
        const extension = upload.name.split(".").pop() || "bin";
        const path = `${user.id}/${crypto.randomUUID()}.${extension}`;
        const { error: uploadError } = await client.storage
          .from("notes-media")
          .upload(path, upload, { cacheControl: "3600", upsert: false });

        if (uploadError) {
          throw uploadError;
        }

        mediaUrl = client.storage.from("notes-media").getPublicUrl(path).data.publicUrl;
      }

      const existing = posts.find((post) => post.id === editingId);
      const payload = {
        author_id: user.id,
        kind: form.kind,
        title: form.title.trim() || null,
        body: form.body.trim(),
        source_label: form.sourceLabel.trim() || null,
        source_url: form.sourceUrl.trim() || null,
        media_url: mediaUrl,
        published: form.published,
        published_at: form.published
          ? existing?.published_at ?? new Date().toISOString()
          : null,
        updated_at: new Date().toISOString(),
      };

      const query = editingId
        ? client.from("notes").update(payload).eq("id", editingId)
        : client.from("notes").insert(payload);
      const { error } = await query;

      if (error) {
        throw error;
      }

      resetForm();
      await loadEditor(user);
      setStatus(wasEditing ? "Note updated." : form.published ? "Note published." : "Draft saved.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "The note could not be saved.");
    } finally {
      setIsSaving(false);
    }
  }

  function editPost(post: StudioPost) {
    setEditingId(post.id);
    setUpload(null);
    setForm({
      kind: post.kind,
      title: post.title ?? "",
      body: post.body,
      sourceLabel: post.source_label ?? "",
      sourceUrl: post.source_url ?? "",
      mediaUrl: post.media_url ?? "",
      published: post.published,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deletePost(post: StudioPost) {
    if (!client || !user || !window.confirm("Delete this note permanently?")) {
      return;
    }
    const { error } = await client.from("notes").delete().eq("id", post.id);
    setStatus(error ? error.message : "Note deleted.");
    if (!error) {
      await loadEditor(user);
    }
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setUpload(null);
  }

  if (!configured || !client) {
    return <StudioSetup />;
  }

  if (isChecking) {
    return <StudioFrame><p className="text-sm text-stone-400">Checking access…</p></StudioFrame>;
  }

  if (!user) {
    return <StudioLogin />;
  }

  if (!isEditor) {
    return (
      <StudioFrame>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-200/65">Access restricted</p>
        <h1 className="mt-4 text-3xl font-semibold text-stone-50">This account is not an editor.</h1>
        <p className="mt-4 max-w-xl leading-7 text-stone-400">Add this account to the site_editors table before using the publishing studio.</p>
        <button className="mt-8 rounded-md border border-white/10 px-4 py-2 text-sm text-stone-300 hover:border-white/20" onClick={() => client.auth.signOut()} type="button">Sign out</button>
      </StudioFrame>
    );
  }

  return (
    <main className="min-h-screen bg-[#11110f] text-stone-100">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
        <header className="flex flex-wrap items-center justify-between gap-5 border-b border-white/10 pb-7">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-200/65">Private publishing</p>
            <h1 className="mt-3 text-3xl font-semibold">Notes Studio</h1>
          </div>
          <div className="flex items-center gap-2">
            <a className="inline-flex h-10 items-center gap-2 rounded-md border border-white/10 px-3 text-sm text-stone-300 hover:border-white/20 hover:text-white" href="/"><ArrowLeft className="h-4 w-4" /> Reader</a>
            <button aria-label="Sign out" className="grid h-10 w-10 place-items-center rounded-md border border-white/10 text-stone-400 hover:border-white/20 hover:text-white" onClick={() => client.auth.signOut()} title="Sign out" type="button"><LogOut className="h-4 w-4" /></button>
          </div>
        </header>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]">
          <form className="rounded-lg border border-amber-200/20 bg-amber-100/[0.025] p-5 sm:p-7" onSubmit={handleSave}>
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">{editingId ? "Edit note" : "New note"}</h2>
              {editingId ? <button className="text-xs text-stone-400 hover:text-white" onClick={resetForm} type="button">Cancel edit</button> : null}
            </div>

            <div className="mt-6 flex flex-wrap gap-1 rounded-lg border border-white/10 bg-black/20 p-1">
              {kinds.map((kind) => (
                <button className={["rounded-md px-3 py-2 text-xs transition", form.kind === kind.id ? "bg-stone-100 text-stone-950" : "text-stone-400 hover:bg-white/[0.06] hover:text-white"].join(" ")} key={kind.id} onClick={() => setForm((current) => ({ ...current, kind: kind.id }))} type="button">{kind.label}</button>
              ))}
            </div>

            <StudioField label="Title" optional><input className={inputClassName} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} placeholder="Optional heading" value={form.title} /></StudioField>
            <StudioField label="Text"><textarea className={`${inputClassName} min-h-44 resize-y`} onChange={(event) => setForm((current) => ({ ...current, body: event.target.value }))} required value={form.body} /></StudioField>

            {(form.kind === "link" || form.kind === "video") ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <StudioField label="Source label" optional><input className={inputClassName} onChange={(event) => setForm((current) => ({ ...current, sourceLabel: event.target.value }))} placeholder="YouTube, article, X…" value={form.sourceLabel} /></StudioField>
                <StudioField label="Source URL"><input className={inputClassName} onChange={(event) => setForm((current) => ({ ...current, sourceUrl: event.target.value }))} type="url" value={form.sourceUrl} /></StudioField>
              </div>
            ) : null}

            {(form.kind === "image" || form.kind === "video") ? (
              <div className="mt-5 rounded-lg border border-dashed border-white/15 p-4">
                <label className="flex cursor-pointer items-center gap-3 text-sm text-stone-300">
                  <ImagePlus className="h-5 w-5 text-amber-100/70" />
                  <span>{upload?.name ?? "Choose media file"}</span>
                  <input accept={form.kind === "image" ? "image/*" : "video/*"} className="sr-only" onChange={(event) => setUpload(event.target.files?.[0] ?? null)} type="file" />
                </label>
                <p className="mt-3 text-xs text-stone-500">Or use a hosted media URL below.</p>
                <input className={`${inputClassName} mt-3`} onChange={(event) => setForm((current) => ({ ...current, mediaUrl: event.target.value }))} placeholder="https://…" type="url" value={form.mediaUrl} />
              </div>
            ) : null}

            <label className="mt-6 flex items-center gap-3 text-sm text-stone-300">
              <input checked={form.published} className="h-4 w-4 accent-amber-200" onChange={(event) => setForm((current) => ({ ...current, published: event.target.checked }))} type="checkbox" />
              Publish immediately
            </label>

            <div className="mt-7 flex items-center gap-4">
              <button className="inline-flex h-11 items-center gap-2 rounded-md bg-stone-100 px-5 text-sm font-medium text-stone-950 transition hover:bg-amber-100 disabled:cursor-wait disabled:opacity-60" disabled={isSaving} type="submit">{editingId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{isSaving ? "Saving…" : editingId ? "Save changes" : "Publish note"}</button>
              {status ? <p aria-live="polite" className="text-sm text-stone-400">{status}</p> : null}
            </div>
          </form>

          <section>
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">Published & drafts</h2>
              <span className="text-xs text-stone-500">{posts.length} total</span>
            </div>
            <div className="mt-5 space-y-3">
              {posts.length ? posts.map((post) => (
                <article className="rounded-lg border border-white/10 bg-white/[0.02] p-4" key={post.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-stone-500"><span>{post.kind}</span><span>·</span><span className={post.published ? "text-emerald-300/70" : "text-amber-200/70"}>{post.published ? "Published" : "Draft"}</span></div>
                      <h3 className="mt-2 truncate font-medium text-stone-100">{post.title || post.body}</h3>
                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-stone-500">{post.body}</p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      {post.source_url ? <a aria-label="Open source" className={iconButtonClassName} href={post.source_url} rel="noreferrer" target="_blank"><ExternalLink className="h-4 w-4" /></a> : null}
                      <button aria-label="Edit note" className={iconButtonClassName} onClick={() => editPost(post)} type="button"><Pencil className="h-4 w-4" /></button>
                      <button aria-label="Delete note" className={`${iconButtonClassName} hover:text-red-300`} onClick={() => deletePost(post)} type="button"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                </article>
              )) : <p className="rounded-lg border border-dashed border-white/10 p-8 text-center text-sm text-stone-500">No notes yet.</p>}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function StudioLogin() {
  const client = getSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!client) return;
    const result = await client.auth.signInWithPassword({ email, password });
    setError(result.error?.message ?? "");
  }

  return (
    <StudioFrame>
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-200/65">Private publishing</p>
      <h1 className="mt-4 text-3xl font-semibold text-stone-50">Notes Studio</h1>
      <form className="mt-8 max-w-sm space-y-4" onSubmit={login}>
        <input autoComplete="email" className={inputClassName} onChange={(event) => setEmail(event.target.value)} placeholder="Email" required type="email" value={email} />
        <input autoComplete="current-password" className={inputClassName} onChange={(event) => setPassword(event.target.value)} placeholder="Password" required type="password" value={password} />
        <button className="h-11 w-full rounded-md bg-stone-100 text-sm font-medium text-stone-950 hover:bg-amber-100" type="submit">Sign in</button>
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
      </form>
    </StudioFrame>
  );
}

function StudioSetup() {
  return (
    <StudioFrame>
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-200/65">Setup required</p>
      <h1 className="mt-4 text-3xl font-semibold text-stone-50">Connect the publishing studio.</h1>
      <p className="mt-4 max-w-xl leading-7 text-stone-400">The public Notes page is ready. Add the two public Supabase values to .env.local and run supabase/schema.sql in your Supabase SQL editor to enable private publishing.</p>
      <div className="mt-7 max-w-xl rounded-lg border border-white/10 bg-black/25 p-5 font-mono text-xs leading-7 text-stone-300">
        <p>NEXT_PUBLIC_SUPABASE_URL=</p>
        <p>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=</p>
      </div>
      <a className="mt-8 inline-flex items-center gap-2 text-sm text-amber-100 hover:text-amber-50" href="/"><ArrowLeft className="h-4 w-4" /> Return to reader</a>
    </StudioFrame>
  );
}

function StudioFrame({ children }: { children: React.ReactNode }) {
  return <main className="grid min-h-screen place-items-center bg-[#11110f] px-5 text-stone-100"><section className="w-full max-w-2xl rounded-lg border border-amber-200/20 bg-amber-100/[0.025] p-7 sm:p-10">{children}</section></main>;
}

function StudioField({ children, label, optional = false }: { children: React.ReactNode; label: string; optional?: boolean }) {
  return <label className="mt-5 block"><span className="mb-2 flex items-center justify-between text-xs text-stone-400"><span>{label}</span>{optional ? <span className="text-stone-600">Optional</span> : null}</span>{children}</label>;
}

const inputClassName = "w-full rounded-md border border-white/10 bg-black/25 px-3 py-2.5 text-sm text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-amber-200/45";
const iconButtonClassName = "grid h-8 w-8 place-items-center rounded-md border border-white/10 text-stone-500 transition hover:border-white/20 hover:text-white";
