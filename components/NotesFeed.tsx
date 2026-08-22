"use client";

import { useEffect, useMemo, useState } from "react";
import { ExternalLink, Image as ImageIcon, Link2, MessageSquareText, Play } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { initialNotes, normalizeNote, type NoteKind, type NotePost } from "@/lib/notes";

type NoteFilter = "all" | NoteKind;

const filters: { id: NoteFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "thought", label: "Thoughts" },
  { id: "link", label: "Links" },
  { id: "image", label: "Images" },
  { id: "video", label: "Video" },
];

export function NotesFeed() {
  const [activeFilter, setActiveFilter] = useState<NoteFilter>("all");
  const [notes, setNotes] = useState<NotePost[]>(initialNotes);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const client = getSupabaseBrowserClient();
    if (!client) {
      return;
    }

    let active = true;
    client
      .from("notes")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false })
      .then(({ data, error }) => {
        if (!active || error) {
          return;
        }
        setNotes((data ?? []).map((row) => normalizeNote(row)));
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedImage) {
      return;
    }

    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedImage(null);
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [selectedImage]);

  const visibleNotes = useMemo(
    () => notes.filter((note) => activeFilter === "all" || note.kind === activeFilter),
    [activeFilter, notes],
  );

  return (
    <article className="content-view-enter mx-auto w-full max-w-[920px] px-5 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-20">
      <header className="border-b border-white/10 pb-10 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-200/65">
          Short-form notebook
        </p>
        <h2 className="mt-4 text-4xl font-semibold text-stone-50 sm:text-5xl">Notes</h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-stone-400 sm:text-lg">
          Short thoughts, shared media, useful links, and project updates that do not need
          an entire chapter.
        </p>
      </header>

      <div className="sticky top-0 z-20 -mx-2 mt-6 overflow-x-auto bg-[#11110f]/92 px-2 py-3 backdrop-blur">
        <div aria-label="Filter notes" className="mx-auto flex w-max gap-1 rounded-lg border border-white/10 bg-black/20 p-1" role="group">
          {filters.map((filter) => (
            <button
              aria-pressed={activeFilter === filter.id}
              className={[
                "rounded-md px-3 py-2 text-xs transition sm:px-4",
                activeFilter === filter.id
                  ? "bg-stone-100 text-stone-950"
                  : "text-stone-400 hover:bg-white/[0.06] hover:text-stone-100",
              ].join(" ")}
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              type="button"
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mt-4 before:absolute before:bottom-0 before:left-[15px] before:top-0 before:w-px before:bg-white/10 sm:before:left-[19px]">
        {visibleNotes.length ? (
          visibleNotes.map((note) => (
            <NoteEntry key={note.id} note={note} onOpenImage={setSelectedImage} />
          ))
        ) : (
          <div className="py-20 text-center text-sm text-stone-500">No published notes in this view yet.</div>
        )}
      </div>

      {selectedImage ? (
        <button
          aria-label="Close image"
          className="fixed inset-0 z-[80] grid cursor-zoom-out place-items-center bg-black/85 p-5 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
          type="button"
        >
          <img alt="Expanded note media" className="max-h-[90vh] max-w-[94vw] rounded-lg object-contain shadow-2xl" src={selectedImage} />
        </button>
      ) : null}
    </article>
  );
}

function NoteEntry({ note, onOpenImage }: { note: NotePost; onOpenImage: (url: string) => void }) {
  const Icon = note.kind === "thought" ? MessageSquareText : note.kind === "link" ? Link2 : note.kind === "image" ? ImageIcon : Play;
  const embedUrl = note.kind === "video" ? getVideoEmbedUrl(note.mediaUrl ?? note.sourceUrl ?? "") : null;

  return (
    <article className="relative grid grid-cols-[31px_minmax(0,1fr)] gap-4 pb-12 sm:grid-cols-[39px_minmax(0,1fr)] sm:gap-6">
      <div className="relative z-10 grid h-8 w-8 place-items-center rounded-full border border-amber-200/30 bg-[#151411] text-amber-100 sm:h-10 sm:w-10">
        <Icon aria-hidden="true" className="h-4 w-4" strokeWidth={1.7} />
      </div>

      <div className="min-w-0 rounded-lg border border-white/10 bg-white/[0.025] p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber-200/60">
            {note.kind}
          </span>
          <time className="text-xs text-stone-500" dateTime={note.publishedAt}>
            {formatNoteDate(note.publishedAt)}
          </time>
        </div>

        {note.title ? <h3 className="mt-4 text-xl font-semibold text-stone-50 sm:text-2xl">{note.title}</h3> : null}
        <p className="mt-4 whitespace-pre-wrap text-[15px] leading-7 text-stone-300 sm:text-base sm:leading-8">{note.body}</p>

        {note.kind === "image" && note.mediaUrl ? (
          <button className="mt-6 block w-full cursor-zoom-in overflow-hidden rounded-lg border border-white/10" onClick={() => onOpenImage(note.mediaUrl!)} type="button">
            <img alt={note.title ?? "Note image"} className="max-h-[620px] w-full object-cover" loading="lazy" src={note.mediaUrl} />
          </button>
        ) : null}

        {note.kind === "video" && embedUrl ? (
          <div className="mt-6 aspect-video overflow-hidden rounded-lg border border-white/10 bg-black">
            <iframe allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="h-full w-full" loading="lazy" src={embedUrl} title={note.title ?? "Embedded video"} />
          </div>
        ) : note.kind === "video" && note.mediaUrl ? (
          <video className="mt-6 max-h-[620px] w-full rounded-lg border border-white/10 bg-black" controls playsInline preload="metadata" src={note.mediaUrl} />
        ) : null}

        {note.sourceUrl ? (
          <a className="mt-6 flex items-center justify-between gap-4 rounded-lg border border-amber-200/20 bg-amber-100/[0.035] px-4 py-4 text-left transition hover:border-amber-200/40 hover:bg-amber-100/[0.06]" href={note.sourceUrl} rel="noreferrer" target="_blank">
            <span className="min-w-0">
              <span className="block text-xs text-stone-500">Shared from</span>
              <span className="mt-1 block truncate text-sm text-stone-200">{note.sourceLabel || getHostname(note.sourceUrl)}</span>
            </span>
            <ExternalLink aria-hidden="true" className="h-4 w-4 shrink-0 text-amber-100/70" />
          </a>
        ) : null}
      </div>
    </article>
  );
}

function formatNoteDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function getHostname(value: string) {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return value;
  }
}

function getVideoEmbedUrl(value: string) {
  try {
    const url = new URL(value);
    if (url.hostname === "youtu.be") {
      return `https://www.youtube-nocookie.com/embed/${url.pathname.slice(1)}`;
    }
    if (url.hostname.includes("youtube.com")) {
      const id = url.searchParams.get("v");
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (url.hostname.includes("vimeo.com")) {
      const id = url.pathname.split("/").filter(Boolean).at(-1);
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch {
    return null;
  }
  return null;
}
