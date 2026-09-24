export function ProgressLock() {
  return (
    <svg
      aria-hidden="true"
      className="progress-lock"
      fill="none"
      viewBox="0 0 32 32"
    >
      <circle className="progress-lock-track" cx="16" cy="16" r="14" />
      <circle className="progress-lock-orbit" cx="16" cy="16" r="14" />
      <path
        className="progress-lock-shackle"
        d="M12.5 14v-2a3.5 3.5 0 0 1 7 0v2"
      />
      <rect className="progress-lock-body" height="10" rx="2" width="11" x="10.5" y="14" />
      <circle className="progress-lock-keyhole" cx="16" cy="19" r="1.2" />
    </svg>
  );
}
