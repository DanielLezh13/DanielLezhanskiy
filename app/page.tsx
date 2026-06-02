"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Content } from "@/components/Content";
import { RightPanel } from "@/components/RightPanel";
import { Sidebar } from "@/components/Sidebar";
import {
  economicsSections,
  frameworkSections,
  getKeyIdeas,
  philosophySections,
  politicsSections,
  psychologySections,
  startSection,
  technologySections,
  topics,
} from "@/lib/content";

export type ContentView =
  | "start"
  | "religion"
  | "politics"
  | "economics"
  | "society"
  | "psychology"
  | "technology"
  | "philosophy";

const viewKeyIdeas: Record<ContentView, string[]> = {
  start: startSection.keyIdeas,
  religion: frameworkSections[0].keyIdeas,
  politics: politicsSections[0].keyIdeas,
  economics: economicsSections[0].keyIdeas,
  society: [
    "Society will cover culture, institutions, identity, norms, and social pressure.",
    "This category looks at how groups shape what people treat as normal.",
    "The focus is structure, not isolated opinions.",
  ],
  psychology: [
    "Human Psychology will cover belief formation, identity, bias, certainty, and motivation.",
    "This category is the lens behind many other sections.",
    "The focus is how people become convinced and resistant to change.",
  ],
  technology: technologySections[0].keyIdeas,
  philosophy: [
    "My Philosophy will collect the personal framework behind the project.",
    "This category will organize the evidence standard, uncertainty standard, and action priorities.",
    "The focus is how to think, not what identity to perform.",
  ],
};

const viewLabels: Record<ContentView, string> = {
  start: startSection.label,
  religion: frameworkSections[0].label,
  politics: politicsSections[0].label,
  economics: "Economics",
  society: "Society",
  psychology: "Human Psychology",
  technology: "Technology",
  philosophy: "My Philosophy",
};

const sectionLabelById = new Map(
  [
    startSection,
    ...frameworkSections,
    ...topics,
    ...politicsSections,
    ...economicsSections,
    ...technologySections,
  ].map((section) => [section.id, section.label]),
);

export default function Home() {
  const scrollContainerRef = useRef<HTMLElement | null>(null);
  const [activeView, setActiveView] = useState<ContentView>("start");
  const [activeSectionId, setActiveSectionId] = useState(startSection.id);
  const [openDrawer, setOpenDrawer] = useState<"contents" | "ideas" | null>(null);

  const scrollToSection = useCallback((sectionId: string) => {
    requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, []);

  const handleSelectView = useCallback((view: ContentView, sectionId?: string) => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "auto" });
    setActiveView(view);
    setOpenDrawer(null);

    if ((view === "religion" || view === "politics" || view === "economics" || view === "philosophy" || view === "psychology" || view === "technology") && sectionId) {
      setActiveSectionId(sectionId);
      return;
    }

    const nextSectionId = view === "start" ? startSection.id : view;
    setActiveSectionId(nextSectionId);
  }, [scrollToSection]);

  const handleSelectSection = useCallback((view: ContentView, sectionId: string) => {
    const sameView = activeView === view;

    setActiveView(view);
    setOpenDrawer(null);
    if (!sameView) {
      setActiveSectionId(sectionId);
    }
    scrollToSection(sectionId);
  }, [activeView, scrollToSection]);

  useEffect(() => {
    if (activeView !== "religion" && activeView !== "politics" && activeView !== "economics" && activeView !== "philosophy" && activeView !== "psychology" && activeView !== "technology") {
      return;
    }

    const sectionIds =
      activeView === "religion"
        ? [
            frameworkSections[0],
            topics[0],
            ...frameworkSections.slice(1),
          ].map((section) => section.id)
        : activeView === "politics"
          ? politicsSections.map((section) => section.id)
          : activeView === "economics"
            ? economicsSections.map((section) => section.id)
            : activeView === "philosophy"
              ? philosophySections.map((section) => section.id)
              : activeView === "psychology"
                ? psychologySections.map((section) => section.id)
                : technologySections.map((section) => section.id);

    const updateActiveSection = () => {
      const current = sectionIds
        .map((id) => {
          const element = document.getElementById(id);
          return element ? { id, top: element.getBoundingClientRect().top } : null;
        })
        .filter((item): item is { id: string; top: number } => Boolean(item))
        .filter((item) => item.top <= 180)
        .at(-1);

      if (current) {
        setActiveSectionId(current.id);
      }
    };

    updateActiveSection();
    const scrollContainer = scrollContainerRef.current;
    scrollContainer?.addEventListener("scroll", updateActiveSection, { passive: true });
    return () => scrollContainer?.removeEventListener("scroll", updateActiveSection);
  }, [activeView, economicsSections, philosophySections, psychologySections, technologySections]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenDrawer(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const usesSectionIdeas =
    activeView === "religion" || activeView === "politics" || activeView === "economics";
  const rightPanelContextLabel = usesSectionIdeas
    ? sectionLabelById.get(activeSectionId) ?? viewLabels[activeView]
    : viewLabels[activeView];
  const rightPanelIdeas = usesSectionIdeas
    ? getKeyIdeas(activeSectionId)
    : viewKeyIdeas[activeView];

  return (
    <main
      className="relative h-screen overflow-y-auto overscroll-none"
      ref={scrollContainerRef}
    >
      <div
        aria-hidden="true"
        className={[
          "fixed inset-0 z-40 bg-black/55 backdrop-blur-sm transition duration-300 xl:hidden",
          openDrawer ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
        onClick={() => setOpenDrawer(null)}
      />

      <button
        aria-label="Open contents"
        className={[
          "fixed left-0 top-[28vh] z-50 grid h-11 w-9 -translate-y-1/2 place-items-center rounded-r-md border border-l-0 border-white/10 bg-[#151411]/90 text-amber-100/80 shadow-[0_16px_50px_rgba(0,0,0,0.34)] backdrop-blur transition hover:border-amber-200/30 hover:text-amber-50 xl:hidden",
          openDrawer === "contents" ? "-translate-x-full opacity-0" : "translate-x-0 opacity-100",
        ].join(" ")}
        onClick={() => setOpenDrawer("contents")}
        type="button"
      >
        <span aria-hidden="true" className="flex flex-col gap-1">
          <span className="block h-px w-4 bg-current" />
          <span className="block h-px w-4 bg-current" />
          <span className="block h-px w-4 bg-current" />
        </span>
      </button>

      <button
        aria-label="Open ideas panel"
        className={[
          "fixed right-0 top-[28vh] z-50 grid h-11 w-9 -translate-y-1/2 place-items-center rounded-l-md border border-r-0 border-white/10 bg-[#151411]/90 text-amber-100/80 shadow-[0_16px_50px_rgba(0,0,0,0.34)] backdrop-blur transition hover:border-amber-200/30 hover:text-amber-50 xl:hidden",
          openDrawer === "ideas" ? "translate-x-full opacity-0" : "translate-x-0 opacity-100",
        ].join(" ")}
        onClick={() => setOpenDrawer("ideas")}
        type="button"
      >
        <svg
          aria-hidden="true"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <path d="M5 6.5A4.5 4.5 0 0 1 9.5 2h5A4.5 4.5 0 0 1 19 6.5v4A4.5 4.5 0 0 1 14.5 15H11l-5 4v-4.4A4.5 4.5 0 0 1 5 10.5z" />
        </svg>
      </button>

      <div className="grid w-full grid-cols-1 xl:grid-cols-[300px_minmax(0,1fr)_340px] 2xl:grid-cols-[330px_minmax(0,1fr)_360px]">
        <div className="hidden min-w-0 xl:block">
          <div className="sticky top-0 h-screen overflow-y-auto border-r border-white/10 bg-[#11110f]/95 shadow-[18px_0_70px_rgba(0,0,0,0.28)]">
            <Sidebar
              activeSectionId={activeSectionId}
              activeView={activeView}
              onSelectView={handleSelectView}
              onSelectSection={handleSelectSection}
              topics={topics}
              frameworkSections={frameworkSections}
            />
          </div>
        </div>

        <div
          className={[
            "fixed inset-y-0 left-0 z-50 w-[min(86vw,360px)] overflow-y-auto bg-[#11110f]/98 shadow-[28px_0_90px_rgba(0,0,0,0.48)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] xl:hidden",
            openDrawer === "contents" ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-200/70">
              Contents
            </p>
            <button
              aria-label="Close contents"
              className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-stone-400 transition hover:border-white/20 hover:text-stone-100"
              onClick={() => setOpenDrawer(null)}
              type="button"
            >
              ×
            </button>
          </div>
          <Sidebar
            activeSectionId={activeSectionId}
            activeView={activeView}
            onSelectView={handleSelectView}
            onSelectSection={handleSelectSection}
            topics={topics}
            frameworkSections={frameworkSections}
          />
        </div>

        <div className="min-w-0">
          <Content
            activeView={activeView}
            frameworkSections={frameworkSections}
            key={activeView}
            topics={topics}
          />
        </div>

        <div
          className={[
            "fixed inset-y-0 right-0 z-50 w-[min(90vw,410px)] overflow-y-auto bg-[#11110f]/98 shadow-[-28px_0_90px_rgba(0,0,0,0.48)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] xl:hidden",
            openDrawer === "ideas" ? "translate-x-0" : "translate-x-full",
          ].join(" ")}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-200/70">
              Ideas
            </p>
            <button
              aria-label="Close ideas panel"
              className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-stone-400 transition hover:border-white/20 hover:text-stone-100"
              onClick={() => setOpenDrawer(null)}
              type="button"
            >
              ×
            </button>
          </div>
          <RightPanel
            contextLabel={rightPanelContextLabel}
            ideas={rightPanelIdeas}
          />
        </div>

        <div className="hidden min-w-0 xl:block">
          <div className="sticky top-0 h-screen overflow-y-auto border-l border-white/10 bg-[#11110f]/95 shadow-[-18px_0_70px_rgba(0,0,0,0.28)]">
            <RightPanel
              contextLabel={rightPanelContextLabel}
              ideas={rightPanelIdeas}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
