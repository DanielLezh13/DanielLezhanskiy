#!/bin/zsh
set -euo pipefail

APP_NAME="Philosophy Reading"
PORT="4319"
STATE_DIR="$HOME/Library/Application Support/PhilosophyReading"
PID_FILE="$STATE_DIR/server.pid"

notify() {
  /usr/bin/osascript -e "display notification \"$1\" with title \"$APP_NAME\"" >/dev/null 2>&1 || true
}

STOPPED=0

if [[ -f "$PID_FILE" ]]; then
  PID="$(<"$PID_FILE")"
  if kill -0 "$PID" >/dev/null 2>&1; then
    kill "$PID" >/dev/null 2>&1 || true
    STOPPED=1
  fi
  rm -f "$PID_FILE"
fi

PORT_PIDS="$(/usr/sbin/lsof -ti tcp:"$PORT" -sTCP:LISTEN 2>/dev/null || true)"
if [[ -n "$PORT_PIDS" ]]; then
  while IFS= read -r PID; do
    [[ -z "$PID" ]] && continue
    kill "$PID" >/dev/null 2>&1 || true
    STOPPED=1
  done <<< "$PORT_PIDS"
fi

if [[ "$STOPPED" -eq 1 ]]; then
  notify "Stopped the local server on port $PORT."
else
  notify "No running server found on port $PORT."
fi
