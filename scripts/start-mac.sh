#!/bin/zsh
set -euo pipefail

PROJECT_DIR="/Users/daniel/dev/philosophy"
APP_NAME="Philosophy Reading"
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

if [[ -f "$PID_FILE" ]] && kill -0 "$(<"$PID_FILE")" >/dev/null 2>&1; then
  /usr/bin/open "$URL"
  notify "Already running on port $PORT."
  exit 0
fi

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

nohup /usr/bin/env npm run dev -- --hostname "$HOST" --port "$PORT" >>"$LOG_FILE" 2>&1 &
SERVER_PID=$!
echo "$SERVER_PID" > "$PID_FILE"

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
