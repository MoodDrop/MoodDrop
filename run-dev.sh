#!/usr/bin/env bash
set -e
# ensure lsof exists (Replit may prompt once)
if ! command -v lsof >/dev/null 2>&1; then nix-env -iA nixpkgs.lsof; fi

# free both ports used by your stack
for p in 5000 5173; do
  PID="$(lsof -ti :$p -sTCP:LISTEN || true)"
  if [ -n "$PID" ]; then
    echo "Killing PID $PID on port $p"
    kill -9 $PID || true
  else
    echo "No process on $p"
  fi
done

# start your app
cd client
npm run dev
