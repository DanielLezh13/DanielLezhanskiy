"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, HomeIcon, Lightbulb, Rss } from "lucide-react";
import { Content, type IdeaSubjectView } from "@/components/Content";
import {
  ReadingNavigator,
  type ReadingNavGroup,
  type ReadingNavItem,
} from "@/components/ReadingNavigator";
import { FloatingRightPanel, type ChatMessage } from "@/components/RightPanel";
import {
  economicsSectionGroups,
  economicsSections,
  frameworkSections,
  getKeyIdeas,
  philosophySectionGroups,
  philosophySections,
  politicsSectionGroups,
  politicsAnalysisSections,
  politicsSections,
  psychologySections,
  startSection,
  technologySections,
  topics,
} from "@/lib/content";

export type ContentView =
  | "start"
  | "current-views"
  | "notes"
  | "ideas"
  | "religion"
  | "politics"
  | "economics"
  | "psychology"
  | "technology"
  | "philosophy";

const viewKeyIdeas: Record<ContentView, string[]> = {
  start: startSection.keyIdeas,
  "current-views": [
    "Current Views condenses the project into provisional positions rather than replacing the full arguments.",
    "Confidence should remain proportional to evidence and open to revision.",
    "The unresolved questions matter alongside the positions themselves.",
  ],
  notes: [
    "Notes holds shorter thoughts, shared media, useful links, and project updates.",
    "The feed preserves ideas that do not need an entire chapter.",
    "Long-form frameworks remain separate from momentary observations.",
  ],
  ideas: [
    "Ideas is the visual entry point into the project's long-form subjects and chapters.",
    "Each chapter opens in the focused reading interface with its original content intact.",
    "The map organizes the project without flattening it into one continuous document.",
  ],
  religion: frameworkSections[0].keyIdeas,
  politics: politicsSections[0].keyIdeas,
  economics: economicsSections[0].keyIdeas,
  psychology: [
    "Human Psychology will cover belief formation, identity, bias, certainty, and motivation.",
    "This category is the lens behind many other sections.",
    "The focus is how people become convinced and resistant to change.",
  ],
  technology: technologySections[0].keyIdeas,
  philosophy: [
    "Philosophy will collect the personal framework behind the project.",
    "This category will organize the evidence standard, uncertainty standard, and action priorities.",
    "The focus is how to think, not what identity to perform.",
  ],
};

const viewLabels: Record<ContentView, string> = {
  start: startSection.label,
  "current-views": "Current Views",
  notes: "Feed",
  ideas: "Ideas",
  religion: frameworkSections[0].label,
  politics: "Politics",
  economics: "Economics",
  psychology: "Human Psychology",
  technology: "Technology",
  philosophy: "Philosophy",
};

const sectionLabelById = new Map(
  [
    startSection,
    ...frameworkSections,
    ...topics,
    ...politicsSectionGroups,
    ...politicsSections,
    ...politicsAnalysisSections,
    ...economicsSectionGroups,
    ...economicsSections,
    ...philosophySectionGroups,
    ...philosophySections,
    ...psychologySections,
    ...technologySections,
  ].map((section) => [section.id, section.label]),
);

function getReadingNavItems(view: ContentView): ReadingNavItem[] {
  if (view === "religion") {
    return [
      frameworkSections[0],
      frameworkSections[1],
      topics[0],
      ...frameworkSections.slice(2),
    ].map(({ id, label }) => ({ id, label }));
  }

  if (view === "politics") {
    return [...politicsSections, ...politicsAnalysisSections].map(
      ({ id, label }) => ({ id, label }),
    );
  }

  if (view === "economics") {
    return economicsSections.map(({ id, label }) => ({ id, label }));
  }

  if (view === "philosophy") {
    return philosophySections.map(({ id, label }) => ({ id, label }));
  }

  if (view === "psychology") {
    return psychologySections.map(({ id, label }) => ({ id, label }));
  }

  if (view === "technology") {
    return technologySections.map(({ id, label }) => ({ id, label }));
  }

  return [];
}

function getReadingNavGroups(view: ContentView): ReadingNavGroup[] | undefined {
  const groups =
    view === "politics"
      ? politicsSectionGroups
      : view === "economics"
        ? economicsSectionGroups
        : view === "philosophy"
          ? philosophySectionGroups
          : undefined;

  if (!groups) return undefined;

  return groups.map((group) => ({
    id: group.id,
    items: group.children.map(({ id, label }) => ({ id, label })),
    label: group.label,
  }));
}

export default function Home() {
  const scrollContainerRef = useRef<HTMLElement | null>(null);
  const [activeView, setActiveView] = useState<ContentView>("start");
  const [activeSectionId, setActiveSectionId] = useState(startSection.id);
  const [rightPanelInput, setRightPanelInput] = useState("");
  const [rightPanelMessages, setRightPanelMessages] = useState<ChatMessage[]>(
    [],
  );
  const [rightPanelSummary, setRightPanelSummary] = useState("");
  const [rightPanelIsLoading, setRightPanelIsLoading] = useState(false);
  const [rightPanelShowIdeas, setRightPanelShowIdeas] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("view") === "notes") {
      setActiveView("notes");
      setActiveSectionId("notes");
      url.searchParams.delete("view");
      window.history.replaceState(
        window.history.state,
        "",
        `${url.pathname}${url.search}${url.hash}`,
      );
    }
  }, []);

  const handleSelectView = useCallback(
    (view: ContentView, sectionId?: string) => {
      scrollContainerRef.current?.scrollTo({ top: 0, behavior: "auto" });
      setActiveView(view);

      if (
        (view === "religion" ||
          view === "politics" ||
          view === "economics" ||
          view === "philosophy" ||
          view === "psychology" ||
          view === "technology") &&
        sectionId
      ) {
        setActiveSectionId(sectionId);
        return;
      }

      const nextSectionId = view === "start" ? startSection.id : view;
      setActiveSectionId(nextSectionId);
    },
    [],
  );

  const handleSelectSection = useCallback(
    (view: ContentView, sectionId: string) => {
      scrollContainerRef.current?.scrollTo({ top: 0, behavior: "auto" });
      setActiveView(view);
      setActiveSectionId(sectionId);
    },
    [],
  );

  const handleOpenIdeaSubject = useCallback((view: IdeaSubjectView) => {
    const firstSectionId = getReadingNavItems(view)[0]?.id ?? view;
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "auto" });
    setActiveSectionId(firstSectionId);
    setActiveView(view);
  }, []);

  const usesSectionIdeas =
    activeView === "religion" ||
    activeView === "politics" ||
    activeView === "economics" ||
    activeView === "philosophy";
  const rightPanelContextLabel = usesSectionIdeas
    ? (sectionLabelById.get(activeSectionId) ?? viewLabels[activeView])
    : viewLabels[activeView];
  const rightPanelIdeas = usesSectionIdeas
    ? getKeyIdeas(activeSectionId)
    : viewKeyIdeas[activeView];
  const rightPanelChatState = {
    input: rightPanelInput,
    isLoading: rightPanelIsLoading,
    messages: rightPanelMessages,
    setInput: setRightPanelInput,
    setIsLoading: setRightPanelIsLoading,
    setMessages: setRightPanelMessages,
    setShowIdeas: setRightPanelShowIdeas,
    setSummary: setRightPanelSummary,
    showIdeas: rightPanelShowIdeas,
    summary: rightPanelSummary,
  };

  const isDestinationView =
    activeView === "start" || activeView === "notes" || activeView === "ideas";

  if (isDestinationView) {
    return (
      <main
        className="relative h-screen overflow-y-auto overscroll-none"
        ref={scrollContainerRef}
      >
        <PrimaryDestinationNav
          activeView={activeView}
          onSelectView={handleSelectView}
        />
        <Content
          activeSectionId={activeSectionId}
          activeView={activeView}
          frameworkSections={frameworkSections}
          key={activeView}
          onOpenIdeaSubject={handleOpenIdeaSubject}
          topics={topics}
        />
      </main>
    );
  }

  const readingNavItems = getReadingNavItems(activeView);

  return (
    <main
      className="reading-page-shell relative h-screen overflow-y-auto overscroll-none"
      ref={scrollContainerRef}
    >
      <ReadingNavigator
        activeId={activeSectionId}
        destinationNav={
          <PrimaryDestinationNav
            activeView={activeView}
            embedded
            onSelectView={handleSelectView}
          />
        }
        groups={getReadingNavGroups(activeView)}
        items={readingNavItems}
        onBack={() => handleSelectView("ideas")}
        onSelect={(sectionId) => handleSelectSection(activeView, sectionId)}
        title={viewLabels[activeView]}
      />
      <Content
        activeSectionId={activeSectionId}
        activeView={activeView}
        frameworkSections={frameworkSections}
        key={`${activeView}:${activeSectionId}`}
        onOpenIdeaSubject={handleOpenIdeaSubject}
        topics={topics}
      />
      <FloatingRightPanel
        chatState={rightPanelChatState}
        contextLabel={rightPanelContextLabel}
        ideas={rightPanelIdeas}
      />
    </main>
  );
}

const primaryDestinations = [
  { icon: HomeIcon, label: "Home", view: "start" as const },
  { icon: Rss, label: "Feed", view: "notes" as const },
  { icon: Lightbulb, label: "Ideas", view: "ideas" as const },
];

function PrimaryDestinationNav({
  activeView,
  embedded = false,
  onSelectView,
}: {
  activeView: ContentView;
  embedded?: boolean;
  onSelectView: (view: ContentView) => void;
}) {
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);
  const activeDestination =
    primaryDestinations.find(({ view }) => view === activeView) ??
    primaryDestinations[2];
  const ActiveIcon = activeDestination.icon;

  useEffect(() => {
    if (!open) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () =>
      document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [open]);

  return (
    <div
      aria-label="Primary pages"
      className={
        embedded ? "relative" : "fixed right-4 top-4 z-[70] sm:right-6 sm:top-6"
      }
      ref={navRef}
    >
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        className="primary-destination-trigger"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <ActiveIcon
          aria-hidden="true"
          className="h-3.5 w-3.5"
          strokeWidth={1.8}
        />
        <span className={embedded ? "hidden sm:inline" : undefined}>
          {activeDestination.label}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          strokeWidth={1.8}
        />
      </button>

      <div
        aria-label="Choose a primary page"
        className={`primary-destination-menu ${open ? "open" : ""}`}
        role="menu"
      >
        {primaryDestinations.map(({ icon: Icon, label, view }) => {
          const active = activeDestination.view === view;

          return (
            <button
              aria-current={active ? "page" : undefined}
              className={active ? "active" : undefined}
              key={view}
              onClick={() => {
                setOpen(false);
                onSelectView(view);
              }}
              role="menuitem"
              type="button"
            >
              <Icon aria-hidden="true" className="h-4 w-4" strokeWidth={1.8} />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
