"use client";

import type { ContentView } from "@/app/page";
import { politicsSections, startSection } from "@/lib/content";
import type { NavTopic, ReadingSection } from "@/lib/content";

type SidebarProps = {
  activeSectionId: string;
  activeView: ContentView;
  onSelectView: (view: ContentView, sectionId?: string) => void;
  onSelectSection: (view: ContentView, sectionId: string) => void;
  topics: NavTopic[];
  frameworkSections: ReadingSection[];
};

export function Sidebar({
  activeSectionId,
  activeView,
  frameworkSections,
  onSelectView,
  onSelectSection,
  topics,
}: SidebarProps) {
  const religion = topics[0];
  const sectionGroups = [
    {
      id: "religion-group",
      label: "Religion",
      view: "religion" as const,
      firstSectionId: "religion-overviews",
      children: [
        frameworkSections[0],
        religion,
        ...frameworkSections.slice(1),
      ],
    },
    {
      id: "politics-group",
      label: "Politics",
      view: "politics" as const,
      firstSectionId: politicsSections[0].id,
      children: politicsSections,
    },
    {
      id: "society-group",
      label: "Society",
      view: "society" as const,
      firstSectionId: undefined,
      children: [],
    },
    {
      id: "psychology-group",
      label: "Human Psychology",
      view: "psychology" as const,
      firstSectionId: undefined,
      children: [],
    },
    {
      id: "technology-group",
      label: "Technology",
      view: "technology" as const,
      firstSectionId: undefined,
      children: [],
    },
    {
      id: "philosophy-group",
      label: "My Philosophy",
      view: "philosophy" as const,
      firstSectionId: undefined,
      children: [],
    },
  ];

  return (
    <aside className="border-b border-white/10 px-5 py-5 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:border-b-0 lg:border-r lg:px-8 lg:py-8">
      <div className="w-full">
        <div className="mb-8">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">
            Philosophy Project
          </p>
          <h1 className="text-xl font-semibold text-stone-100">Reading Notes</h1>
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

              {sectionGroups.map((group) => {
                const groupActive = activeView === group.view;
                const groupExpanded = groupActive && group.children.length > 0;

                return (
                  <div key={group.id}>
                    <SidebarButton
                      active={groupActive}
                      expandable={group.children.length > 0}
                      expanded={groupExpanded}
                      label={group.label}
                      onClick={() => {
                        if (activeView === group.view) {
                          return;
                        }

                        onSelectView(group.view, group.firstSectionId);
                      }}
                    />

                    <div
                      className={[
                        "grid transition-[grid-template-rows] duration-300 ease-out",
                        groupExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                      ].join(" ")}
                    >
                      <div className="overflow-hidden">
                        <div className="ml-2 mt-1 space-y-1 border-l border-white/10 pl-2">
                          {group.children.map((section) => (
                            <SidebarButton
                              active={activeSectionId === section.id}
                              key={section.id}
                              label={section.label}
                              nested
                              onClick={() => onSelectSection(group.view, section.id)}
                            />
                          ))}
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
  expandable = false,
  expanded = false,
  label,
  nested = false,
  onClick,
}: {
  active: boolean;
  disabled?: boolean;
  expandable?: boolean;
  expanded?: boolean;
  label: string;
  nested?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={[
        "flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left transition duration-200",
        nested ? "text-[13px]" : "text-sm",
        disabled
          ? "cursor-not-allowed text-stone-600"
          : active
          ? "bg-stone-100 text-stone-950 shadow-sm"
          : "text-stone-400 hover:bg-white/[0.06] hover:text-stone-100",
      ].join(" ")}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <span>{label}</span>
      {expandable ? (
        <span
          aria-hidden="true"
          className={[
            "grid h-5 w-5 shrink-0 place-items-center rounded-full border text-sm leading-none transition duration-200",
            active ? "border-stone-300 text-stone-950" : "border-white/10 text-stone-500",
            expanded ? "rotate-180" : "rotate-0",
          ].join(" ")}
        >
          ↓
        </span>
      ) : null}
    </button>
  );
}
