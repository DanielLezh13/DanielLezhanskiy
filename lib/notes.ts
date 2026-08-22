export type NoteKind = "thought" | "link" | "image" | "video";

export type NotePost = {
  id: string;
  kind: NoteKind;
  body: string;
  title?: string | null;
  sourceLabel?: string | null;
  sourceUrl?: string | null;
  mediaUrl?: string | null;
  publishedAt: string;
  createdAt?: string;
};

export const initialNotes: NotePost[] = [
  {
    id: "notes-introduction",
    kind: "thought",
    title: "A place for shorter thoughts",
    body:
      "This is where I’ll share shorter thoughts, links, media, and project updates that do not need an entire chapter. The longer sections develop complete frameworks; these notes can stay closer to the moment they came from.",
    publishedAt: "2026-08-06T12:00:00.000Z",
  },
];

export function normalizeNote(row: Record<string, unknown>): NotePost {
  return {
    id: String(row.id),
    kind: (row.kind as NoteKind) ?? "thought",
    body: String(row.body ?? ""),
    title: typeof row.title === "string" ? row.title : null,
    sourceLabel:
      typeof row.source_label === "string" ? row.source_label : null,
    sourceUrl: typeof row.source_url === "string" ? row.source_url : null,
    mediaUrl: typeof row.media_url === "string" ? row.media_url : null,
    publishedAt: String(row.published_at ?? row.created_at ?? new Date().toISOString()),
    createdAt: typeof row.created_at === "string" ? row.created_at : undefined,
  };
}
