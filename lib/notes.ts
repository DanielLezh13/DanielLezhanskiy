export type NoteKind = "thought" | "link" | "image" | "video";
export type NoteMediaType = "image" | "video";
export type NoteAttachmentKind = "image" | "video" | "pdf" | "file";

export type NoteAttachment = {
  url: string;
  name: string;
  mimeType: string;
  size: number;
  kind: NoteAttachmentKind;
};

export type NoteComment = {
  id: string;
  noteId: string;
  body: string;
  attachments: NoteAttachment[];
  createdAt: string;
  updatedAt?: string;
};

export type NotePost = {
  id: string;
  kind: NoteKind;
  body: string;
  title?: string | null;
  sourceLabel?: string | null;
  sourceUrl?: string | null;
  mediaUrl?: string | null;
  mediaUrls: string[];
  mediaType?: NoteMediaType | null;
  attachments: NoteAttachment[];
  publishedAt: string;
  createdAt?: string;
  updatedAt?: string;
};

export const initialNotes: NotePost[] = [
  {
    id: "notes-introduction",
    kind: "thought",
    title: "A place for shorter thoughts",
    body: "This is where I’ll share shorter thoughts, links, media, and project updates that do not need an entire chapter. The longer sections develop complete frameworks; these notes can stay closer to the moment they came from.",
    mediaUrls: [],
    attachments: [],
    publishedAt: "2026-08-06T12:00:00.000Z",
  },
];

export function normalizeNote(row: Record<string, unknown>): NotePost {
  const legacyMediaUrl =
    typeof row.media_url === "string" ? row.media_url : null;
  const mediaUrls = Array.isArray(row.media_urls)
    ? row.media_urls.filter(
        (value): value is string => typeof value === "string",
      )
    : legacyMediaUrl
      ? [legacyMediaUrl]
      : [];
  const mediaType =
    row.media_type === "image" || row.media_type === "video"
      ? row.media_type
      : inferMediaType(legacyMediaUrl, row.kind);
  const attachments = normalizeAttachments(row.attachments);
  const resolvedAttachments = attachments.length
    ? attachments
    : mediaUrls.map((url, index) => ({
        url,
        name: `Attached ${mediaType === "video" ? "video" : "image"}${mediaUrls.length > 1 ? ` ${index + 1}` : ""}`,
        mimeType: mediaType === "video" ? "video/mp4" : "image/jpeg",
        size: 0,
        kind: mediaType === "video" ? ("video" as const) : ("image" as const),
      }));

  return {
    id: String(row.id),
    kind: (row.kind as NoteKind) ?? "thought",
    body: String(row.body ?? ""),
    title: typeof row.title === "string" ? row.title : null,
    sourceLabel: typeof row.source_label === "string" ? row.source_label : null,
    sourceUrl: typeof row.source_url === "string" ? row.source_url : null,
    mediaUrl: legacyMediaUrl,
    mediaUrls,
    mediaType,
    attachments: resolvedAttachments,
    publishedAt: String(
      row.published_at ?? row.created_at ?? new Date().toISOString(),
    ),
    createdAt: typeof row.created_at === "string" ? row.created_at : undefined,
    updatedAt: typeof row.updated_at === "string" ? row.updated_at : undefined,
  };
}

export function normalizeNoteComment(
  row: Record<string, unknown>,
): NoteComment {
  return {
    id: String(row.id),
    noteId: String(row.note_id),
    body: String(row.body ?? ""),
    attachments: normalizeAttachments(row.attachments),
    createdAt: String(row.created_at ?? new Date().toISOString()),
    updatedAt: typeof row.updated_at === "string" ? row.updated_at : undefined,
  };
}

function normalizeAttachments(value: unknown): NoteAttachment[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const record = item as Record<string, unknown>;
    const url = typeof record.url === "string" ? record.url : "";
    const kind = record.kind;
    if (
      !url ||
      (kind !== "image" &&
        kind !== "video" &&
        kind !== "pdf" &&
        kind !== "file")
    ) {
      return [];
    }

    return [
      {
        url,
        name:
          typeof record.name === "string" && record.name
            ? record.name
            : "Attached file",
        mimeType: typeof record.mimeType === "string" ? record.mimeType : "",
        size: typeof record.size === "number" ? record.size : 0,
        kind,
      },
    ];
  });
}

export function deriveNoteKind({
  mediaType,
  sourceUrl,
}: {
  mediaType?: NoteMediaType | null;
  sourceUrl?: string | null;
}): NoteKind {
  if (mediaType === "video") return "video";
  if (mediaType === "image") return "image";
  if (sourceUrl) return "link";
  return "thought";
}

function inferMediaType(
  mediaUrl: string | null,
  kind: unknown,
): NoteMediaType | null {
  if (kind === "image" || kind === "video") return kind;
  if (!mediaUrl) return null;
  return /\.(mp4|webm|mov)(?:$|[?#])/i.test(mediaUrl) ? "video" : "image";
}
