"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./DanielSectionNav.module.css";

const sections = [
  { id: "daniel-profile", label: "Profile" },
  { id: "daniel-about", label: "About" },
  { id: "daniel-favorites", label: "Favorites" },
  { id: "daniel-photos", label: "Photos" },
  { id: "daniel-projects", label: "Projects" },
  { id: "daniel-fortnite", label: "Fortnite" },
  { id: "daniel-ai", label: "AI" },
  { id: "daniel-goal", label: "Goal" },
] as const;

export function DanielSectionNav() {
  const [activeId, setActiveId] = useState<string>(sections[0].id);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    const button = nav?.querySelector<HTMLButtonElement>(`button[data-section="${activeId}"]`);
    if (!nav || !button) return;
    const navBounds = nav.getBoundingClientRect();
    const buttonBounds = button.getBoundingClientRect();
    nav.scrollTo({
      left: nav.scrollLeft + buttonBounds.left - navBounds.left - (navBounds.width - buttonBounds.width) / 2,
      behavior: "smooth",
    });
  }, [activeId]);

  useEffect(() => {
    const scrollRoot = document.querySelector("main");
    if (!scrollRoot) return;

    const targets = sections.map(({ id }) => document.getElementById(id));
    const updateActive = () => {
      const readingLine = scrollRoot.getBoundingClientRect().top + scrollRoot.clientHeight * 0.36;
      let nextId: string = sections[0].id;

      targets.forEach((target, index) => {
        if (target && target.getBoundingClientRect().top <= readingLine) {
          nextId = sections[index].id;
        }
      });
      setActiveId((current) => current === nextId ? current : nextId);
    };

    const observer = new IntersectionObserver(updateActive, {
      root: scrollRoot,
      rootMargin: "-33% 0px -64% 0px",
    });
    targets.forEach((target) => {
      if (target) observer.observe(target);
    });
    updateActive();
    window.addEventListener("resize", updateActive);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateActive);
    };
  }, []);

  const navigateTo = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    setActiveId(id);
    target.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <nav aria-label="Daniel page sections" className={styles.nav} ref={navRef}>
      {sections.map(({ id, label }) => (
        <button
          aria-current={activeId === id ? "location" : undefined}
          data-section={id}
          key={id}
          onClick={() => navigateTo(id)}
          type="button"
        >
          {label}
        </button>
      ))}
    </nav>
  );
}
