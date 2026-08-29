"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ArrowLeft } from "lucide-react";

export type ReadingNavItem = {
  id: string;
  label: string;
};

export type ReadingNavGroup = {
  id: string;
  label: string;
  items: ReadingNavItem[];
};

type ReadingNavigatorProps = {
  activeId: string;
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
  const submenuButtonRefs = useRef<Record<string, HTMLButtonElement | null>>(
    {},
  );
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reflowTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reflowFrameRef = useRef<number | null>(null);
  const dockStateReadyRef = useRef(false);
  const [docked, setDocked] = useState(false);
  const [reflowing, setReflowing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [previewGroupId, setPreviewGroupId] = useState<string | null>(null);
  const [hoveredSubmenuId, setHoveredSubmenuId] = useState<string | null>(null);
  const [groupIndicator, setGroupIndicator] = useState(hiddenIndicator);
  const [submenuIndicator, setSubmenuIndicator] = useState(hiddenIndicator);

  const hasGroups = Boolean(groups?.length);
  const activeGroup = groups?.find((group) =>
    group.items.some((item) => item.id === activeId),
  );
  const previewGroup =
    groups?.find((group) => group.id === previewGroupId) ??
    activeGroup ??
    groups?.[0];
  const highlightedGroupId = previewGroup?.id ?? activeGroup?.id;
  const highlightedSubmenuId = hoveredSubmenuId ?? activeId;

  const positionIndicator = useCallback(
    (
      container: HTMLDivElement | null,
      target: HTMLElement | null | undefined,
      setter: (indicator: Indicator) => void,
    ) => {
      if (!container || !target) {
        setter(hiddenIndicator);
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

  const positionSubmenuIndicator = useCallback(
    (target: HTMLElement | null | undefined) => {
      const container = submenuTrackRef.current;

      if (!container || !target) {
        setSubmenuIndicator((current) => ({
          ...current,
          visible: false,
        }));
        return;
      }

      positionIndicator(container, target, setSubmenuIndicator);
    },
    [positionIndicator],
  );

  const openGroup = useCallback((groupId: string) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setPreviewGroupId(groupId);
    setMenuOpen(true);
  }, []);

  const scheduleClose = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setMenuOpen(false);
      setPreviewGroupId(activeGroup?.id ?? null);
      setHoveredSubmenuId(null);
    }, 180);
  }, [activeGroup?.id]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
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
      if (highlightedGroupId) {
        positionIndicator(
          groupTrackRef.current,
          groupButtonRefs.current[highlightedGroupId],
          setGroupIndicator,
        );
      }
      if (highlightedSubmenuId) {
        positionSubmenuIndicator(
          submenuButtonRefs.current[highlightedSubmenuId],
        );
      }
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
    if (!hasGroups || !highlightedGroupId) return;
    positionIndicator(
      groupTrackRef.current,
      groupButtonRefs.current[highlightedGroupId],
      setGroupIndicator,
    );
  }, [hasGroups, highlightedGroupId, positionIndicator]);

  useLayoutEffect(() => {
    if (!hasGroups || !highlightedSubmenuId) return;
    positionSubmenuIndicator(submenuButtonRefs.current[highlightedSubmenuId]);
  }, [
    hasGroups,
    highlightedSubmenuId,
    positionSubmenuIndicator,
    previewGroup?.id,
  ]);

  useEffect(() => {
    if (!hasGroups) return;

    const updateIndicators = () => {
      if (highlightedGroupId) {
        positionIndicator(
          groupTrackRef.current,
          groupButtonRefs.current[highlightedGroupId],
          setGroupIndicator,
        );
      }
      if (highlightedSubmenuId) {
        positionSubmenuIndicator(
          submenuButtonRefs.current[highlightedSubmenuId],
        );
      }
    };

    const resizeObserver = new ResizeObserver(updateIndicators);
    if (groupTrackRef.current) resizeObserver.observe(groupTrackRef.current);
    if (submenuTrackRef.current)
      resizeObserver.observe(submenuTrackRef.current);
    window.addEventListener("resize", updateIndicators);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateIndicators);
    };
  }, [
    hasGroups,
    highlightedGroupId,
    highlightedSubmenuId,
    positionIndicator,
    positionSubmenuIndicator,
    previewGroup?.id,
  ]);

  return (
    <nav
      aria-label={`${title} contents`}
      className={`reading-navigator${hasGroups ? " grouped" : ""}${docked ? " docked" : ""}${menuOpen ? " menu-open" : ""}${reflowing ? " reflowing" : ""}`}
      onMouseEnter={() => {
        if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      }}
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
                return (
                  <button
                    aria-expanded={menuOpen && group.id === previewGroup?.id}
                    className={active ? "active" : undefined}
                    key={group.id}
                    onClick={() => onSelect(group.items[0].id)}
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
              items={items}
              onSelect={onSelect}
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
                  return (
                    <button
                      aria-current={active ? "page" : undefined}
                      className={active ? "active" : undefined}
                      data-section-id={item.id}
                      key={item.id}
                      onClick={() => onSelect(item.id)}
                      onFocus={() => setHoveredSubmenuId(item.id)}
                      onMouseEnter={() => setHoveredSubmenuId(item.id)}
                      onMouseLeave={() => setHoveredSubmenuId(null)}
                      ref={(node) => {
                        submenuButtonRefs.current[item.id] = node;
                      }}
                      title={cleanReadingLabel(item.label)}
                      type="button"
                    >
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      {cleanReadingLabel(item.label)}
                    </button>
                  );
                })}
                <span
                  aria-hidden="true"
                  className="reading-navigator-submenu-indicator"
                  key={`${previewGroup.id}:${previewGroup.items.some((item) => item.id === activeId) ? activeId : "preview"}`}
                  style={{
                    opacity: submenuIndicator.visible ? 1 : 0,
                    transform: `translateX(${submenuIndicator.left}px)`,
                    width: submenuIndicator.width,
                  }}
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </nav>
  );
}

function FlatReadingTrack({
  activeId,
  items,
  onSelect,
  trackRef,
}: {
  activeId: string;
  items: ReadingNavItem[];
  onSelect: (id: string) => void;
  trackRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="reading-navigator-track" ref={trackRef}>
      {items.map((item, index) => {
        const active = item.id === activeId;
        return (
          <button
            aria-current={active ? "page" : undefined}
            className={active ? "active" : undefined}
            data-section-id={item.id}
            key={item.id}
            onClick={() => onSelect(item.id)}
            title={cleanReadingLabel(item.label)}
            type="button"
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {cleanReadingLabel(item.label)}
          </button>
        );
      })}
    </div>
  );
}

function cleanGroupLabel(label: string) {
  return label.replace(/^Section\s+\d+\s*[—-]\s*/, "");
}

function cleanReadingLabel(label: string) {
  return label
    .replace(/^Case Study\s+\d+\s*[—-]\s*/, "")
    .replace(/^Section\s+\d+\s*\/\s*Part\s+[\d.]+\s*[—-]\s*/, "")
    .replace(/^Part\s+[\d.]+\s*[—-]\s*/, "")
    .replace(/^Section\s+[\d.]+\s*[—-]\s*/, "");
}
