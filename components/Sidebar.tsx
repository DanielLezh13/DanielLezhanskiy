"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ContentView } from "@/app/page";
import {
  economicsSectionGroups,
  philosophySectionGroups,
  politicsSectionGroups,
  psychologySectionGroups,
  startSection,
  technologySectionGroups,
} from "@/lib/content";
import type {
  NavTopic,
  ReadingSection,
  ReadingSectionGroup,
} from "@/lib/content";

type SidebarProps = {
  activeSectionId: string;
  activeView: ContentView;
  onSelectView: (view: ContentView, sectionId?: string) => void;
  onSelectSection: (view: ContentView, sectionId: string) => void;
  onSelectSectionGroup: (view: ContentView, sectionId: string) => void;
  topics: NavTopic[];
  frameworkSections: ReadingSection[];
};

export function Sidebar({
  activeSectionId,
  activeView,
  frameworkSections,
  onSelectView,
  onSelectSection,
  onSelectSectionGroup,
  topics,
}: SidebarProps) {
  const switchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [openView, setOpenView] = useState<ContentView | null>(null);
  const [openEconomicsSectionId, setOpenEconomicsSectionId] = useState<
    string | null
  >(null);

  const religion = topics[0];
  const sectionGroups = useMemo(
    () => [
      {
        id: "philosophy-group",
        label: "Philosophy",
        view: "philosophy" as const,
        firstSectionId: philosophySectionGroups[0]?.firstSectionId,
        children: philosophySectionGroups,
      },
      {
        id: "religion-group",
        label: "Religion",
        view: "religion" as const,
        firstSectionId: frameworkSections[0]?.id,
        children: [
          frameworkSections[0],
          frameworkSections[1],
          religion,
          ...frameworkSections.slice(2),
        ],
      },
      {
        id: "politics-group",
        label: "Politics",
        view: "politics" as const,
        firstSectionId: politicsSectionGroups[0]?.firstSectionId,
        children: politicsSectionGroups,
      },
      {
        id: "economics-group",
        label: "Economics",
        view: "economics" as const,
        firstSectionId: economicsSectionGroups[0]?.firstSectionId,
        children: economicsSectionGroups,
      },
      {
        id: "psychology-group",
        label: "Human Psychology",
        view: "psychology" as const,
        firstSectionId: psychologySectionGroups[0]?.firstSectionId,
        children: psychologySectionGroups,
      },
      {
        id: "technology-group",
        label: "Technology",
        view: "technology" as const,
        firstSectionId: technologySectionGroups[0]?.firstSectionId,
        children: technologySectionGroups,
      },
    ],
    [
      frameworkSections,
      religion,
      economicsSectionGroups,
      philosophySectionGroups,
      politicsSectionGroups,
      psychologySectionGroups,
      technologySectionGroups,
    ],
  );

  useEffect(() => {
    if (
      activeView !== "economics" &&
      activeView !== "politics" &&
      activeView !== "religion" &&
      activeView !== "philosophy" &&
      activeView !== "psychology" &&
      activeView !== "technology"
    ) {
      setOpenEconomicsSectionId(null);
    }
  }, [activeView]);

  useEffect(() => {
    if (switchTimer.current) {
      clearTimeout(switchTimer.current);
      switchTimer.current = null;
    }

    const activeGroup = sectionGroups.find(
      (group) => group.view === activeView,
    );
    if (!activeGroup?.children.length) {
      setOpenView(null);
      return;
    }

    setOpenView((current) => {
      if (!current || current === activeView) {
        return activeView;
      }

      switchTimer.current = setTimeout(() => {
        setOpenView(activeView);
      }, 190);

      return null;
    });

    return () => {
      if (switchTimer.current) {
        clearTimeout(switchTimer.current);
        switchTimer.current = null;
      }
    };
  }, [activeView, sectionGroups]);

  return (
    <aside className="px-5 py-5">
      <div className="w-full">
        <div className="mb-8">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">
            Philosophy Project
          </p>
          <h1 className="text-xl font-semibold text-stone-100">
            Reading Notes
          </h1>
        </div>

        <nav aria-label="Reading sections" className="space-y-8">
          <div>
            <NavHeading label="Contents" />
            <div className="space-y-1">
              <SidebarButton
                active={activeView === "start"}
                label={startSection.label}
                onClick={() => onSelectView("start")}
              />

              <SidebarButton
                active={activeView === "current-views"}
                label="Current Views"
                onClick={() => onSelectView("current-views")}
              />

              <SidebarButton
                active={activeView === "notes"}
                label="Feed"
                onClick={() => onSelectView("notes")}
              />

              <SidebarButton
                active={activeView === "ideas"}
                label="Ideas"
                onClick={() => onSelectView("ideas")}
              />

              {sectionGroups.map((group) => {
                const groupActive = activeView === group.view;
                const groupExpanded =
                  openView === group.view && group.children.length > 0;

                return (
                  <div key={group.id}>
                    <SidebarButton
                      active={groupActive}
                      expanded={groupExpanded}
                      label={group.label}
                      onArrowClick={
                        group.children.length
                          ? () => {
                              if (activeView !== group.view) {
                                if (
                                  group.view === "economics" ||
                                  group.view === "politics" ||
                                  group.view === "religion" ||
                                  group.view === "philosophy" ||
                                  group.view === "psychology"
                                ) {
                                  setOpenEconomicsSectionId(null);
                                }
                                onSelectView(group.view, group.firstSectionId);
                                return;
                              }

                              setOpenView((current) => {
                                if (
                                  group.view === "economics" ||
                                  group.view === "politics" ||
                                  group.view === "religion" ||
                                  group.view === "philosophy" ||
                                  group.view === "psychology"
                                ) {
                                  setOpenEconomicsSectionId(null);
                                }
                                return current === group.view
                                  ? null
                                  : group.view;
                              });
                            }
                          : undefined
                      }
                      onClick={() => {
                        if (
                          group.view === "economics" ||
                          group.view === "politics" ||
                          group.view === "religion" ||
                          group.view === "philosophy" ||
                          group.view === "psychology"
                        ) {
                          setOpenEconomicsSectionId(null);
                        }
                        onSelectView(group.view, group.firstSectionId);
                      }}
                    />

                    <div
                      className={[
                        "grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                        groupExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                      ].join(" ")}
                    >
                      <div className="overflow-hidden">
                        <div
                          className={[
                            "ml-2 mt-1 space-y-1 border-l border-white/10 pl-2 transition duration-300 ease-out",
                            groupExpanded
                              ? "translate-y-0 opacity-100"
                              : "-translate-y-1 opacity-0",
                          ].join(" ")}
                        >
                          {group.children.map((item) => {
                            if (isReadingSectionGroup(item)) {
                              const itemExpanded =
                                openEconomicsSectionId === item.id;
                              const itemActive =
                                activeSectionId === item.id ||
                                activeSectionId === item.firstSectionId ||
                                item.children.some(
                                  (section) => activeSectionId === section.id,
                                );

                              return (
                                <div className="pt-2" key={item.id}>
                                  <SidebarButton
                                    active={itemActive}
                                    expanded={itemExpanded}
                                    label={item.label}
                                    nested
                                    onArrowClick={() => {
                                      setOpenEconomicsSectionId((current) =>
                                        current === item.id ? null : item.id,
                                      );
                                    }}
                                    onClick={() =>
                                      onSelectSectionGroup(group.view, item.id)
                                    }
                                  />
                                  <div
                                    className={[
                                      "grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                                      itemExpanded
                                        ? "grid-rows-[1fr]"
                                        : "grid-rows-[0fr]",
                                    ].join(" ")}
                                  >
                                    <div className="overflow-hidden">
                                      <div
                                        className={[
                                          "ml-2 mt-1 space-y-1 border-l border-white/10 pl-2 transition duration-300 ease-out",
                                          itemExpanded
                                            ? "translate-y-0 opacity-100"
                                            : "-translate-y-1 opacity-0",
                                        ].join(" ")}
                                      >
                                        {item.children.map((section) => (
                                          <SidebarButton
                                            active={
                                              activeSectionId === section.id
                                            }
                                            key={section.id}
                                            label={formatSidebarLabel(
                                              section.label,
                                            )}
                                            nested
                                            onClick={() =>
                                              onSelectSection(
                                                group.view,
                                                section.id,
                                              )
                                            }
                                          />
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            }

                            if (isTopicGroup(item)) {
                              const itemExpanded =
                                openEconomicsSectionId === item.id;
                              const itemActive =
                                activeSectionId === item.id ||
                                item.children.some(
                                  (section) => activeSectionId === section.id,
                                );

                              return (
                                <div className="pt-2" key={item.id}>
                                  <SidebarButton
                                    active={itemActive}
                                    expanded={itemExpanded}
                                    label={item.label}
                                    nested
                                    onArrowClick={() => {
                                      setOpenEconomicsSectionId((current) =>
                                        current === item.id ? null : item.id,
                                      );
                                    }}
                                    onClick={() =>
                                      onSelectSection(group.view, item.id)
                                    }
                                  />
                                  <div
                                    className={[
                                      "grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                                      itemExpanded
                                        ? "grid-rows-[1fr]"
                                        : "grid-rows-[0fr]",
                                    ].join(" ")}
                                  >
                                    <div className="overflow-hidden">
                                      <div
                                        className={[
                                          "ml-2 mt-1 space-y-1 border-l border-white/10 pl-2 transition duration-300 ease-out",
                                          itemExpanded
                                            ? "translate-y-0 opacity-100"
                                            : "-translate-y-1 opacity-0",
                                        ].join(" ")}
                                      >
                                        {item.children.map((section) => (
                                          <SidebarButton
                                            active={
                                              activeSectionId === section.id
                                            }
                                            key={section.id}
                                            label={section.label}
                                            nested
                                            onClick={() =>
                                              onSelectSection(
                                                group.view,
                                                section.id,
                                              )
                                            }
                                          />
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            }

                            return (
                              <SidebarButton
                                active={activeSectionId === item.id}
                                key={item.id}
                                label={formatSidebarLabel(item.label)}
                                nested
                                onClick={() =>
                                  onSelectSection(group.view, item.id)
                                }
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
}

function isReadingSectionGroup(item: object): item is ReadingSectionGroup {
  return (
    "firstSectionId" in item &&
    "children" in item &&
    Array.isArray((item as ReadingSectionGroup).children)
  );
}

function isTopicGroup(
  item: object,
): item is NavTopic & { children: ReadingSection[] } {
  return (
    !("firstSectionId" in item) &&
    "children" in item &&
    Array.isArray((item as { children?: unknown }).children)
  );
}

function NavHeading({ label }: { label: string }) {
  return (
    <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500">
      {label}
    </p>
  );
}

function SidebarButton({
  active,
  disabled = false,
  expanded = false,
  label,
  nested = false,
  onArrowClick,
  onClick,
}: {
  active: boolean;
  disabled?: boolean;
  expanded?: boolean;
  label: string;
  nested?: boolean;
  onArrowClick?: () => void;
  onClick: () => void;
}) {
  const displayLabel = formatSidebarLabel(label);

  return (
    <button
      className={[
        "flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left transition duration-200",
        nested ? "text-[13px]" : "text-sm",
        disabled
          ? "cursor-default text-stone-600"
          : active
            ? "bg-stone-100 text-stone-950 shadow-sm"
            : "text-stone-400 hover:bg-white/[0.06] hover:text-stone-100",
      ].join(" ")}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <span>{displayLabel}</span>
      {onArrowClick ? (
        <span
          aria-hidden="true"
          onClick={(event) => {
            event.stopPropagation();
            onArrowClick();
          }}
          className={[
            "grid h-5 w-5 shrink-0 place-items-center rounded-full border text-sm leading-none transition duration-300 hover:scale-110",
            active
              ? "border-stone-300 text-stone-950 hover:border-stone-500 hover:bg-stone-200"
              : "border-white/10 text-stone-500 hover:border-stone-500 hover:bg-white/10 hover:text-stone-100",
            expanded ? "rotate-180" : "rotate-0",
          ].join(" ")}
        >
          ↓
        </span>
      ) : null}
    </button>
  );
}

function formatSidebarLabel(label: string) {
  return label
    .replace(/^Section\s+\d+\s*\/\s*Part\s+([\d.]+)\s+[—-]\s+/, "$1. ")
    .replace(/^Part\s+([\d.]+)\s+[—-]\s+/, "$1. ");
}
