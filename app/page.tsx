"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Content } from "@/components/Content";
import { RightPanel } from "@/components/RightPanel";
import { Sidebar } from "@/components/Sidebar";
import {
  frameworkSections,
  getKeyIdeas,
  politicsSections,
  startSection,
  topics,
} from "@/lib/content";

export type ContentView =
  | "start"
  | "religion"
  | "politics"
  | "society"
  | "psychology"
  | "technology"
  | "philosophy";

const viewKeyIdeas: Record<ContentView, string[]> = {
  start: startSection.keyIdeas,
  religion: frameworkSections[0].keyIdeas,
  politics: politicsSections[0].keyIdeas,
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
  technology: [
    "Technology will cover AI, algorithms, attention, social media, and information systems.",
    "This category looks at how tools reshape belief and behavior.",
    "The focus is how systems amplify certainty, distortion, and speed.",
  ],
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
  ].map((section) => [section.id, section.label]),
);

export default function Home() {
  const scrollContainerRef = useRef<HTMLElement | null>(null);
  const [activeView, setActiveView] = useState<ContentView>("start");
  const [activeSectionId, setActiveSectionId] = useState(startSection.id);

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

    if ((view === "religion" || view === "politics") && sectionId) {
      setActiveSectionId(sectionId);
      return;
    }

    const nextSectionId = view === "start" ? startSection.id : view;
    setActiveSectionId(nextSectionId);
  }, [scrollToSection]);

  const handleSelectSection = useCallback((view: ContentView, sectionId: string) => {
    const sameView = activeView === view;

    setActiveView(view);
    if (!sameView) {
      setActiveSectionId(sectionId);
    }
    scrollToSection(sectionId);
  }, [activeView, scrollToSection]);

  useEffect(() => {
    if (activeView !== "religion" && activeView !== "politics") {
      return;
    }

    const sectionIds =
      activeView === "religion"
        ? [
            frameworkSections[0],
            topics[0],
            ...frameworkSections.slice(1),
          ].map((section) => section.id)
        : politicsSections.map((section) => section.id);

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
  }, [activeView]);

  return (
    <main
      className="h-screen overflow-y-auto overscroll-none"
      ref={scrollContainerRef}
    >
      <div className="grid w-full grid-cols-1 lg:grid-cols-[330px_minmax(0,1fr)_340px]">
        <Sidebar
          activeSectionId={activeSectionId}
          activeView={activeView}
          onSelectView={handleSelectView}
          onSelectSection={handleSelectSection}
          topics={topics}
          frameworkSections={frameworkSections}
        />

        <Content
          activeView={activeView}
          frameworkSections={frameworkSections}
          key={activeView}
          topics={topics}
        />

        <RightPanel
          contextLabel={
            activeView === "religion" || activeView === "politics"
              ? sectionLabelById.get(activeSectionId) ?? viewLabels[activeView]
              : viewLabels[activeView]
          }
          ideas={
            activeView === "religion"
            || activeView === "politics"
              ? getKeyIdeas(activeSectionId)
              : viewKeyIdeas[activeView]
          }
        />
      </div>
    </main>
  );
}
