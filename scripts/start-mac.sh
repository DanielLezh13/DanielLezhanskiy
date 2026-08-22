#!/bin/zsh
set -euo pipefail

PROJECT_DIR="/Users/daniel/dev/philosophy"
APP_NAME="Philosophy Reading"
JOB_LABEL="com.daniel.philosophy-reading"
HOST="127.0.0.1"
PORT="4319"
URL="http://localhost:${PORT}"
STATE_DIR="$HOME/Library/Application Support/PhilosophyReading"
PID_FILE="$STATE_DIR/server.pid"
LOG_FILE="$STATE_DIR/server.log"

mkdir -p "$STATE_DIR"

notify() {
  /usr/bin/osascript -e "display notification \"$1\" with title \"$APP_NAME\"" >/dev/null 2>&1 || true
}

if /usr/bin/curl -fsS "$URL" >/dev/null 2>&1; then
  /usr/bin/open "$URL"
  notify "Already running on port $PORT."
  exit 0
fi

# Clear stale state from the older nohup-based launcher.
rm -f "$PID_FILE"
/bin/launchctl remove "$JOB_LABEL" >/dev/null 2>&1 || true

PORT_PID="$(/usr/sbin/lsof -ti tcp:"$PORT" -sTCP:LISTEN 2>/dev/null | head -n 1 || true)"
if [[ -n "$PORT_PID" ]]; then
  notify "Port $PORT is already in use. Stop the other process or change this app's port."
  /usr/bin/open "$URL"
  exit 0
fi

cd "$PROJECT_DIR"

if [[ ! -d node_modules ]]; then
  /usr/bin/env npm install >>"$LOG_FILE" 2>&1
fi

# Next.js only allows one development server per project. Stop any existing
# server that still owns this project's lock before starting the shortcut job.
LOCK_FILE="$PROJECT_DIR/.next/dev/lock"
LOCK_PIDS="$(/usr/sbin/lsof -ti "$LOCK_FILE" 2>/dev/null || true)"
if [[ -n "$LOCK_PIDS" ]]; then
  while IFS= read -r LOCK_PID; do
    [[ -z "$LOCK_PID" ]] && continue
    kill "$LOCK_PID" >/dev/null 2>&1 || true
  done <<< "$LOCK_PIDS"

  for _ in {1..20}; do
    [[ ! -e "$LOCK_FILE" ]] && break
    sleep 0.1
  done
fi

/bin/launchctl submit \
  -l "$JOB_LABEL" \
  -o "$LOG_FILE" \
  -e "$LOG_FILE" \
  -- /bin/zsh -lc \
  "cd ${(q)PROJECT_DIR} && exec /usr/bin/env npm run dev -- --hostname ${(q)HOST} --port ${(q)PORT}"

for _ in {1..40}; do
  if /usr/bin/curl -fsS "$URL" >/dev/null 2>&1; then
    /usr/bin/open "$URL"
    notify "Running at $URL."
    exit 0
  fi
  sleep 0.25
done

/usr/bin/open "$URL"
notify "Starting on port $PORT. If it is still loading, give it a few seconds."
