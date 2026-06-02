"use client";

import { useId, useState } from "react";
import type { ArgumentBlock } from "@/lib/content";

type CollapsibleProps = {
  argument: ArgumentBlock;
  responseLabel?: string;
  tagClassName?: string;
};

export function Collapsible({
  argument,
  responseLabel = "Response",
  tagClassName = "border-white/10 bg-white/[0.04] text-stone-400",
}: CollapsibleProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="group overflow-hidden rounded-lg border border-white/10 bg-white/[0.025] transition duration-200 hover:border-white/20 hover:bg-white/[0.04]">
      <button
        aria-controls={panelId}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition duration-200"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <span className="text-base font-medium text-stone-100 transition duration-200 group-hover:text-white">
            {argument.title}
          </span>
          {argument.tags?.length ? (
            <span className="flex flex-wrap gap-2">
              {argument.tags.map((tag) => (
                <span
                  className={[
                    "rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em]",
                    tagClassName,
                  ].join(" ")}
                  key={tag}
                >
                  {tag}
                </span>
              ))}
            </span>
          ) : null}
        </span>
        <span
          className={[
            "grid h-7 w-7 shrink-0 place-items-center rounded-full border text-lg leading-none transition duration-200 hover:border-white/40 hover:bg-white hover:text-stone-950",
            open
              ? "rotate-45 border-white bg-stone-100 text-stone-950"
              : "rotate-0 border-white/10 text-stone-400",
          ].join(" ")}
          aria-hidden="true"
        >
          +
        </span>
      </button>

      <div
        className={[
          "grid transition-[grid-template-rows] duration-300 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        ].join(" ")}
        id={panelId}
      >
        <div className="overflow-hidden">
          <div className="space-y-5 border-t border-white/10 px-5 py-5">
            <div>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-amber-200/70">
                Claim
              </p>
              <p className="whitespace-pre-line text-base leading-8 text-stone-300">
                {argument.claim}
              </p>
            </div>
            <div>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-amber-200/70">
                {responseLabel}
              </p>
              <p className="whitespace-pre-line text-base leading-8 text-stone-300">
                {argument.response}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
