"use client";

import { useEffect, useState } from "react";
import { ProgressLock } from "@/components/ProgressLock";

const AUTO_DISMISS_DELAY_MS = 4_500;

export function ProgressNotice({
  label,
  onDismiss,
  placement = "right",
}: {
  label: string | null;
  onDismiss: () => void;
  placement?: "left" | "right";
}) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (!label) return;
    const timer = window.setTimeout(() => setExiting(true), AUTO_DISMISS_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [label]);

  useEffect(() => {
    if (!exiting) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onDismiss();
      return;
    }

    // Animation end removes the notice; this only covers interrupted animations.
    const timer = window.setTimeout(onDismiss, 800);
    return () => window.clearTimeout(timer);
  }, [exiting, onDismiss]);

  if (!label) return null;

  return (
    <div
      className={`progress-note progress-note-${placement}${exiting ? " progress-note-exiting" : ""}`}
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget && event.animationName === "progress-note-exit") {
          onDismiss();
        }
      }}
      role="status"
    >
      <span className="progress-note-icon" aria-hidden="true">
        <ProgressLock />
      </span>
      <p>
        <strong>{label} is taking shape.</strong> I’m giving these ideas the time
        and depth they deserve before opening them up.
      </p>
      <button
        aria-label="Dismiss explanation"
        className="progress-note-close"
        onClick={() => setExiting(true)}
        type="button"
      >
        ×
      </button>
    </div>
  );
}
