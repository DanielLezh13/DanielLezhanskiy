"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Rss } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Content, type IdeaSubjectView } from "@/components/Content";
import { DanielSectionNav } from "@/components/DanielSectionNav";
import {
  ReadingNavigator,
  type ReadingNavGroup,
  type ReadingNavItem,
} from "@/components/ReadingNavigator";
import { FloatingRightPanel, type ChatMessage } from "@/components/RightPanel";
import { isSectionInProgress } from "@/lib/publication-status";
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
  psychologySectionGroups,
  psychologySections,
  startSection,
  technologySectionGroups,
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
    ...psychologySectionGroups,
    ...psychologySections,
    ...technologySectionGroups,
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
    ].map(({ id, label }) => ({
      id,
      label,
      inProgress: isSectionInProgress(id),
    }));
  }

  if (view === "politics") {
    return [...politicsSections, ...politicsAnalysisSections].map(
      ({ id, label }) => ({ id, label, inProgress: isSectionInProgress(id) }),
    );
  }

  if (view === "economics") {
    return economicsSections.map(({ id, label }) => ({
      id,
      label,
      inProgress: isSectionInProgress(id),
    }));
  }

  if (view === "philosophy") {
    return philosophySections.map(({ id, label }) => ({ id, label }));
  }

  if (view === "psychology") {
    return psychologySections.map(({ id, label }) => ({
      id,
      label,
      inProgress: isSectionInProgress(id),
    }));
  }

  if (view === "technology") {
    return technologySections.map(({ id, label }) => ({
      id,
      label,
      inProgress: isSectionInProgress(id),
    }));
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
          : view === "psychology"
            ? psychologySectionGroups
            : view === "technology"
              ? technologySectionGroups
              : undefined;

  if (!groups) return undefined;

  return groups.map((group) => ({
    id: group.id,
    items: group.children.map(({ id, label }) => ({
      id,
      label,
      inProgress: isSectionInProgress(id),
    })),
    label: group.label,
  }));
}

export default function Home() {
  const client = getSupabaseBrowserClient();
  const scrollContainerRef = useRef<HTMLElement | null>(null);
  const [canOpenDrafts, setCanOpenDrafts] = useState(false);
  const [activeView, setActiveView] = useState<ContentView>("ideas");
  const [activeSectionId, setActiveSectionId] = useState("ideas");
  const [rightPanelInput, setRightPanelInput] = useState("");
  const [rightPanelMessages, setRightPanelMessages] = useState<ChatMessage[]>(
    [],
  );
  const [rightPanelSummary, setRightPanelSummary] = useState("");
  const [rightPanelIsLoading, setRightPanelIsLoading] = useState(false);
  const [rightPanelShowIdeas, setRightPanelShowIdeas] = useState(false);

  useEffect(() => {
    if (!client) return;

    let active = true;
    let requestId = 0;
    let verifiedEditorId: string | null = null;
    const checkEditorAccess = async () => {
      const currentRequest = ++requestId;
      try {
        const { data: { user }, error: authError } = await client.auth.getUser();
        if (!active || currentRequest !== requestId) return;
        if (authError || !user) {
          verifiedEditorId = null;
          setCanOpenDrafts(false);
          return;
        }

        const { data, error } = await client
          .from("site_editors")
          .select("user_id")
          .eq("user_id", user.id)
          .maybeSingle();
        if (active && currentRequest === requestId) {
          verifiedEditorId = !error && data ? user.id : null;
          setCanOpenDrafts(Boolean(verifiedEditorId));
        }
      } catch {
        if (active && currentRequest === requestId) {
          verifiedEditorId = null;
          setCanOpenDrafts(false);
        }
      }
    };

    void checkEditorAccess();
    const { data } = client.auth.onAuthStateChange((_event, session) => {
      if (session?.user.id !== verifiedEditorId) {
        verifiedEditorId = null;
        setCanOpenDrafts(false);
      }
      window.setTimeout(() => void checkEditorAccess(), 0);
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, [client]);

  useEffect(() => {
    if (!canOpenDrafts && isSectionInProgress(activeSectionId)) {
      setActiveView("ideas");
      setActiveSectionId("ideas");
    }
  }, [activeSectionId, canOpenDrafts]);

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
      if (sectionId && isSectionInProgress(sectionId) && !canOpenDrafts) {
        return;
      }
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
    [canOpenDrafts],
  );

  const handleSelectSection = useCallback(
    (
      view: ContentView,
      sectionId: string,
      scrollBehavior: ScrollBehavior = "auto",
    ) => {
      if (isSectionInProgress(sectionId) && !canOpenDrafts) return;
      scrollContainerRef.current?.scrollTo({ top: 0, behavior: scrollBehavior });
      setActiveView(view);
      setActiveSectionId(sectionId);
    },
    [canOpenDrafts],
  );

  const handleOpenIdeaSubject = useCallback((view: IdeaSubjectView) => {
    const firstSectionId = getReadingNavItems(view)[0]?.id ?? view;
    if (isSectionInProgress(firstSectionId) && !canOpenDrafts) return;
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "auto" });
    setActiveSectionId(firstSectionId);
    setActiveView(view);
  }, [canOpenDrafts]);

  const visibleView =
    !canOpenDrafts && isSectionInProgress(activeSectionId)
      ? "ideas"
      : activeView;
  const readingNavItems = useMemo(
    () => getReadingNavItems(visibleView),
    [visibleView],
  );
  const navigableReadingItems = useMemo(
    () => readingNavItems.filter((item) => canOpenDrafts || !item.inProgress),
    [canOpenDrafts, readingNavItems],
  );
  const activeReadingIndex = navigableReadingItems.findIndex(
    (item) => item.id === activeSectionId,
  );
  const usesSectionIdeas =
    visibleView === "religion" ||
    visibleView === "politics" ||
    visibleView === "economics" ||
    visibleView === "philosophy" ||
    visibleView === "psychology" ||
    visibleView === "technology";
  const rightPanelContextLabel = usesSectionIdeas
    ? (sectionLabelById.get(activeSectionId) ?? viewLabels[visibleView])
    : viewLabels[visibleView];
  const rightPanelIdeas = usesSectionIdeas
    ? getKeyIdeas(activeSectionId)
    : viewKeyIdeas[visibleView];
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

  const handleMoveReadingPage = useCallback(
    (direction: -1 | 1) => {
      if (activeReadingIndex < 0) return;
      const nextItem = navigableReadingItems[activeReadingIndex + direction];
      if (nextItem) handleSelectSection(visibleView, nextItem.id, "smooth");
    },
    [activeReadingIndex, handleSelectSection, navigableReadingItems, visibleView],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey
      ) {
        return;
      }

      const target = event.target;
      if (
        target instanceof HTMLElement &&
        target.matches(
          "input, textarea, select, [contenteditable='true'], [role='textbox']",
        )
      ) {
        return;
      }

      if (event.key === "ArrowLeft" && activeReadingIndex > 0) {
        event.preventDefault();
        handleMoveReadingPage(-1);
      } else if (
        event.key === "ArrowRight" &&
        activeReadingIndex >= 0 &&
        activeReadingIndex < navigableReadingItems.length - 1
      ) {
        event.preventDefault();
        handleMoveReadingPage(1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeReadingIndex, handleMoveReadingPage, navigableReadingItems.length]);

  const isDestinationView =
    visibleView === "start" || visibleView === "notes" || visibleView === "ideas";

  if (isDestinationView) {
    return (
      <main
        className="relative h-screen overflow-y-auto overscroll-none"
        ref={scrollContainerRef}
      >
        {visibleView !== "ideas" ? (
          <MapReturnControl onClick={() => handleSelectView("ideas")} />
        ) : null}
        {visibleView !== "notes" ? (
          <FeedControl onClick={() => handleSelectView("notes")} />
        ) : null}
        {visibleView === "start" ? <DanielSectionNav /> : null}
        <Content
          activeSectionId={activeSectionId}
          activeView={visibleView}
          canOpenDrafts={canOpenDrafts}
          frameworkSections={frameworkSections}
          key={visibleView}
          onOpenHome={() => handleSelectView("start")}
          onOpenIdeaSubject={handleOpenIdeaSubject}
          topics={topics}
        />
      </main>
    );
  }

  return (
    <main
      className="reading-page-shell relative h-screen overflow-y-auto overscroll-none"
      ref={scrollContainerRef}
    >
      <ReadingNavigator
        activeId={activeSectionId}
        canOpenDrafts={canOpenDrafts}
        destinationNav={
          <FeedControl embedded onClick={() => handleSelectView("notes")} />
        }
        groups={getReadingNavGroups(visibleView)}
        items={readingNavItems}
        onBack={() => handleSelectView("ideas")}
        onSelect={(sectionId) => handleSelectSection(activeView, sectionId)}
        title={viewLabels[visibleView]}
      />
      <Content
        activeSectionId={activeSectionId}
        activeView={visibleView}
        canOpenDrafts={canOpenDrafts}
        frameworkSections={frameworkSections}
        key={`${visibleView}:${activeSectionId}`}
        onOpenHome={() => handleSelectView("start")}
        onOpenIdeaSubject={handleOpenIdeaSubject}
        topics={topics}
      />
      <ReadingPageControls
        currentIndex={activeReadingIndex}
        items={navigableReadingItems}
        onMove={handleMoveReadingPage}
      />
      <FloatingRightPanel
        chatState={rightPanelChatState}
        contextLabel={rightPanelContextLabel}
        contextSectionId={usesSectionIdeas ? activeSectionId : undefined}
        ideas={rightPanelIdeas}
      />
    </main>
  );
}

function ReadingPageControls({
  currentIndex,
  items,
  onMove,
}: {
  currentIndex: number;
  items: ReadingNavItem[];
  onMove: (direction: -1 | 1) => void;
}) {
  if (currentIndex < 0 || items.length < 2) return null;

  const previous = items[currentIndex - 1];
  const next = items[currentIndex + 1];

  return (
    <nav aria-label="Chapter navigation" className="reading-page-controls">
      <button
        aria-label={previous ? `Previous chapter: ${previous.label}` : "No previous chapter"}
        className="reading-page-control reading-page-control-previous"
        disabled={!previous}
        onClick={() => onMove(-1)}
        type="button"
      >
        <ArrowLeft aria-hidden="true" size={16} strokeWidth={1.8} />
        <span className="reading-page-control-copy">
          <span className="reading-page-control-direction">Previous</span>
          <span className="reading-page-control-title">{previous?.label ?? "Beginning"}</span>
        </span>
      </button>
      <span aria-hidden="true" className="reading-page-count">
        {String(currentIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
      </span>
      <button
        aria-label={next ? `Next chapter: ${next.label}` : "No next chapter"}
        className="reading-page-control reading-page-control-next"
        disabled={!next}
        onClick={() => onMove(1)}
        type="button"
      >
        <span className="reading-page-control-copy">
          <span className="reading-page-control-direction">Next</span>
          <span className="reading-page-control-title">{next?.label ?? "End"}</span>
        </span>
        <ArrowRight aria-hidden="true" size={16} strokeWidth={1.8} />
      </button>
    </nav>
  );
}

function FeedControl({ embedded = false, onClick }: { embedded?: boolean; onClick: () => void }) {
  return (
    <button
      className={`site-feed-control${embedded ? " embedded" : ""}`}
      onClick={onClick}
      type="button"
    >
      <Rss aria-hidden="true" size={15} strokeWidth={1.8} />
      <span>Feed</span>
    </button>
  );
}

function MapReturnControl({ onClick }: { onClick: () => void }) {
  return (
    <button className="site-map-return" onClick={onClick} type="button">
      <ArrowLeft aria-hidden="true" size={16} strokeWidth={1.8} />
      <span>Ideas</span>
    </button>
  );
}
