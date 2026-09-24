"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { ArrowLeft } from "lucide-react";
import { ProgressLock } from "@/components/ProgressLock";
import { ProgressNotice } from "@/components/ProgressNotice";
import styles from "./ReadingNavigator.module.css";

export type ReadingNavItem = {
  id: string;
  label: string;
  inProgress?: boolean;
};

export type ReadingNavGroup = {
  id: string;
  label: string;
  items: ReadingNavItem[];
};

type ReadingNavigatorProps = {
  activeId: string;
  canOpenDrafts: boolean;
  destinationNav?: ReactNode;
  groups?: ReadingNavGroup[];
  items: ReadingNavItem[];
  onBack: () => void;
  onSelect: (id: string) => void;
  title: string;
};

type Indicator = {
  left: number;
  visible: boolean;
  width: number;
};

const hiddenIndicator: Indicator = { left: 0, visible: false, width: 0 };

export function ReadingNavigator({
  activeId,
  canOpenDrafts,
  destinationNav,
  groups,
  items,
  onBack,
  onSelect,
  title,
}: ReadingNavigatorProps) {
  const navRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const groupTrackRef = useRef<HTMLDivElement | null>(null);
  const submenuTrackRef = useRef<HTMLDivElement | null>(null);
  const groupButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const reflowTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reflowFrameRef = useRef<number | null>(null);
  const dockStateReadyRef = useRef(false);
  const [docked, setDocked] = useState(false);
  const [reflowing, setReflowing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [previewGroupId, setPreviewGroupId] = useState<string | null>(null);
  const [groupIndicator, setGroupIndicator] = useState(hiddenIndicator);
  const [lockedItem, setLockedItem] = useState<{ label: string; sequence: number } | null>(null);

  const showLockedItem = (label: string) => {
    setLockedItem((current) => ({ label, sequence: (current?.sequence ?? 0) + 1 }));
  };

  const hasGroups = Boolean(groups?.length);
  const activeGroup = groups?.find((group) =>
    group.items.some((item) => item.id === activeId),
  );
  const previewGroup =
    groups?.find((group) => group.id === previewGroupId) ??
    activeGroup ??
    groups?.[0];
  const highlightedGroupId = previewGroupId ?? activeGroup?.id;
  const highlightedGroupIdRef = useRef(highlightedGroupId);
  highlightedGroupIdRef.current = highlightedGroupId;

  const positionIndicator = useCallback(
    (
      container: HTMLDivElement | null,
      target: HTMLElement | null | undefined,
      setter: Dispatch<SetStateAction<Indicator>>,
    ) => {
      if (!container || !target) {
        setter((current) => current.visible ? { ...current, visible: false } : current);
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      setter({
        left: targetRect.left - containerRect.left + container.scrollLeft,
        visible: true,
        width: targetRect.width,
      });
    },
    [],
  );

  const openGroup = useCallback((groupId: string) => {
    setPreviewGroupId(groupId);
    setMenuOpen(true);
  }, []);

  const scheduleClose = useCallback(() => {
    setMenuOpen(false);
    setPreviewGroupId(activeGroup?.id ?? null);
  }, [activeGroup?.id]);

  useEffect(() => {
    return () => {
      if (reflowTimerRef.current) clearTimeout(reflowTimerRef.current);
      if (reflowFrameRef.current) cancelAnimationFrame(reflowFrameRef.current);
    };
  }, []);

  useLayoutEffect(() => {
    if (!dockStateReadyRef.current) {
      dockStateReadyRef.current = true;
      return;
    }

    if (reflowTimerRef.current) clearTimeout(reflowTimerRef.current);
    if (reflowFrameRef.current) cancelAnimationFrame(reflowFrameRef.current);
    setReflowing(true);

    const startedAt = performance.now();
    const syncIndicators = () => {
      const targetId = highlightedGroupIdRef.current;
      positionIndicator(
        groupTrackRef.current,
        targetId ? groupButtonRefs.current[targetId] : null,
        setGroupIndicator,
      );
    };

    const trackIndicators = () => {
      syncIndicators();
      if (performance.now() - startedAt < 500) {
        reflowFrameRef.current = requestAnimationFrame(trackIndicators);
      }
    };

    trackIndicators();
    reflowTimerRef.current = setTimeout(() => {
      if (reflowFrameRef.current) cancelAnimationFrame(reflowFrameRef.current);
      syncIndicators();
      reflowFrameRef.current = requestAnimationFrame(() => {
        reflowFrameRef.current = requestAnimationFrame(() => {
          setReflowing(false);
          reflowFrameRef.current = null;
        });
      });
    }, 500);
  }, [docked]);

  useEffect(() => {
    if (!menuOpen) setPreviewGroupId(activeGroup?.id ?? null);
  }, [activeGroup?.id, menuOpen]);

  useEffect(() => {
    const nav = navRef.current;
    const scrollContainer = nav?.closest<HTMLElement>(".reading-page-shell");
    if (!scrollContainer) return;

    const updateDockedState = () => {
      const dockThreshold = window.matchMedia("(max-width: 700px)").matches
        ? 8
        : 18;
      setDocked(scrollContainer.scrollTop >= dockThreshold);
    };
    updateDockedState();
    scrollContainer.addEventListener("scroll", updateDockedState, {
      passive: true,
    });

    return () =>
      scrollContainer.removeEventListener("scroll", updateDockedState);
  }, []);

  useEffect(() => {
    const track = hasGroups ? submenuTrackRef.current : trackRef.current;
    const activeItem = track?.querySelector<HTMLElement>(
      `[data-section-id="${CSS.escape(activeId)}"]`,
    );

    if (!track || !activeItem) return;

    track.scrollTo({
      behavior: "smooth",
      left:
        activeItem.offsetLeft -
        track.clientWidth / 2 +
        activeItem.clientWidth / 2,
    });
  }, [activeId, hasGroups, previewGroup?.id]);

  useLayoutEffect(() => {
    if (!hasGroups) return;
    positionIndicator(
      groupTrackRef.current,
      highlightedGroupId ? groupButtonRefs.current[highlightedGroupId] : null,
      setGroupIndicator,
    );
  }, [hasGroups, highlightedGroupId, positionIndicator]);

  useEffect(() => {
    if (!hasGroups) return;

    const updateIndicators = () => {
      positionIndicator(
        groupTrackRef.current,
        highlightedGroupId ? groupButtonRefs.current[highlightedGroupId] : null,
        setGroupIndicator,
      );
    };

    const resizeObserver = new ResizeObserver(updateIndicators);
    if (groupTrackRef.current) resizeObserver.observe(groupTrackRef.current);
    window.addEventListener("resize", updateIndicators);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateIndicators);
    };
  }, [
    hasGroups,
    highlightedGroupId,
    positionIndicator,
  ]);

  const selectItem = (item: ReadingNavItem) => {
    if (item.inProgress && !canOpenDrafts) {
      showLockedItem(cleanReadingLabel(item.label));
      return;
    }
    setLockedItem(null);
    onSelect(item.id);
  };

  return (
    <>
    <nav
      aria-label={`${title} contents`}
      className={`reading-navigator${hasGroups ? " grouped" : ""}${docked ? " docked" : ""}${menuOpen ? " menu-open" : ""}${reflowing ? " reflowing" : ""}`}
      onMouseLeave={hasGroups ? scheduleClose : undefined}
      ref={navRef}
    >
      <div className="reading-navigator-frame">
        <div className="reading-navigator-inner">
          <button
            aria-label="Back to Ideas"
            className="reading-navigator-back"
            onClick={onBack}
            title="Back to Ideas"
            type="button"
          >
            <ArrowLeft aria-hidden="true" size={17} strokeWidth={1.8} />
          </button>
          <div className="reading-navigator-title">
            <span>Ideas</span>
            <strong>{title}</strong>
          </div>

          {hasGroups ? (
            <div
              className="reading-navigator-groups"
              ref={groupTrackRef}
              style={{ gap: docked ? "clamp(44px, 14vw, 190px)" : undefined }}
            >
              {groups?.map((group) => {
                const active = group.id === activeGroup?.id;
                const firstAvailableItem = group.items.find(
                  (item) => canOpenDrafts || !item.inProgress,
                );
                return (
                  <button
                    aria-disabled={!firstAvailableItem}
                    aria-expanded={menuOpen && group.id === previewGroup?.id}
                    aria-label={`${cleanGroupLabel(group.label)}${firstAvailableItem ? "" : ", work in progress; show explanation"}`}
                    className={active ? "active" : undefined}
                    key={group.id}
                    onClick={() => {
                      if (firstAvailableItem) selectItem(firstAvailableItem);
                      else showLockedItem(cleanGroupLabel(group.label));
                    }}
                    onFocus={() => openGroup(group.id)}
                    onMouseEnter={() => openGroup(group.id)}
                    ref={(node) => {
                      groupButtonRefs.current[group.id] = node;
                    }}
                    type="button"
                  >
                    <span>{cleanGroupLabel(group.label)}</span>
                  </button>
                );
              })}
              <span
                aria-hidden="true"
                className="reading-navigator-group-indicator"
                style={{
                  opacity: groupIndicator.visible ? 1 : 0,
                  transform: `translateX(${groupIndicator.left}px)`,
                  width: groupIndicator.width,
                }}
              />
            </div>
          ) : (
            <FlatReadingTrack
              activeId={activeId}
              canOpenDrafts={canOpenDrafts}
              items={items}
              onSelect={selectItem}
              trackRef={trackRef}
            />
          )}
          {destinationNav ? (
            <div className="reading-navigator-destination">
              {destinationNav}
            </div>
          ) : null}
        </div>

        {hasGroups && previewGroup ? (
          <div className="reading-navigator-submenu">
            <div className="reading-navigator-submenu-viewport">
              <div
                className="reading-navigator-submenu-track"
                key={previewGroup.id}
                ref={submenuTrackRef}
              >
                {previewGroup.items.map((item, index) => {
                  const active = item.id === activeId;
                  const number = readingItemNumber(item.label, index);
                  return (
                    <button
                      aria-current={active ? "page" : undefined}
                      aria-disabled={item.inProgress && !canOpenDrafts}
                      aria-label={`${item.label}${item.inProgress && !canOpenDrafts ? ", work in progress; show explanation" : ""}`}
                      className={[
                        styles.submenuItem,
                        active && "active",
                        active && styles.selected,
                        item.inProgress && "reading-item-in-progress",
                      ].filter(Boolean).join(" ") || undefined}
                      data-section-id={item.id}
                      key={item.id}
                      onClick={() => selectItem(item)}
                      title={cleanReadingLabel(item.label)}
                      type="button"
                    >
                      {number ? <span>{number}</span> : null}
                      {cleanReadingLabel(item.label)}
                      {item.inProgress ? (
                        <span aria-hidden="true" className="reading-item-status">
                          <ProgressLock />
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </nav>
    <ProgressNotice
      key={lockedItem?.sequence ?? "hidden"}
      label={lockedItem?.label ?? null}
      onDismiss={() => setLockedItem(null)}
      placement="left"
    />
    </>
  );
}

function FlatReadingTrack({
  activeId,
  canOpenDrafts,
  items,
  onSelect,
  trackRef,
}: {
  activeId: string;
  canOpenDrafts: boolean;
  items: ReadingNavItem[];
  onSelect: (item: ReadingNavItem) => void;
  trackRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="reading-navigator-track" ref={trackRef}>
      {items.map((item, index) => {
        const active = item.id === activeId;
        const number = readingItemNumber(item.label, index);
        return (
          <button
            aria-current={active ? "page" : undefined}
            aria-disabled={item.inProgress && !canOpenDrafts}
            aria-label={`${item.label}${item.inProgress && !canOpenDrafts ? ", work in progress; show explanation" : ""}`}
            className={[
              active && "active",
              item.inProgress && "reading-item-in-progress",
            ].filter(Boolean).join(" ") || undefined}
            data-section-id={item.id}
            key={item.id}
            onClick={() => onSelect(item)}
            title={cleanReadingLabel(item.label)}
            type="button"
          >
            {number ? <span>{number}</span> : null}
            {cleanReadingLabel(item.label)}
            {item.inProgress ? (
              <span aria-hidden="true" className="reading-item-status">
                <ProgressLock />
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

function cleanGroupLabel(label: string) {
  return label.replace(/^Section\s+\d+\s*[—-]\s*/, "");
}

function readingItemNumber(label: string, index: number) {
  if (/^(Introduction|Conclusion)\b/.test(label)) return null;
  const part = label.match(/\bPart\s+([\d.]+)/);
  if (part) return part[1].padStart(2, "0");
  const caseStudy = label.match(/^Case Study\s+(\d+)/);
  if (caseStudy) return caseStudy[1].padStart(2, "0");
  return String(index + 1).padStart(2, "0");
}

function cleanReadingLabel(label: string) {
  return label
    .replace(/^Case Study\s+\d+\s*[—-]\s*/, "")
    .replace(/^Section\s+\d+\s*\/\s*Part\s+[\d.]+\s*[—-]\s*/, "")
    .replace(/^Part\s+[\d.]+\s*[—-]\s*/, "")
    .replace(/^Section\s+[\d.]+\s*[—-]\s*/, "");
}
