#!/usr/bin/env bash
# ----------------------------------------------------------------------------
# deploy.sh — clone/pull from GitHub, build, and (re)start the app via pm2.
#
# Usage:
#   ./deploy.sh                  # uses defaults below
#   BRANCH=staging ./deploy.sh   # override branch
#   PORT=4000 ./deploy.sh        # override pm2 port
#
# Credentials:
#   Set GITHUB_USERNAME and GITHUB_TOKEN as env vars, or drop them into a
#   `.env.deploy` file next to this script (which is gitignored). The token
#   should be a fine-grained PAT with `Contents: read` on this repo.
#
#   Example .env.deploy:
#     GITHUB_USERNAME=sage-rebirth
#     GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
#     REPO_OWNER=sage-rebirth
#     REPO_NAME=commission-mukt-bharat
# ----------------------------------------------------------------------------
set -euo pipefail

# ---------- Config (override via env or .env.deploy) ------------------------
APP_NAME="${APP_NAME:-commission-mukt-bharat}"
APP_DIR="${APP_DIR:-/home/ubuntu/${APP_NAME}}"
BRANCH="${BRANCH:-main}"
PORT="${PORT:-3000}"
REPO_OWNER="${REPO_OWNER:-techblueera}"
REPO_NAME="${REPO_NAME:-commission-mukt-bharat}"

# ---------- Load .env.deploy if present -------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/.env.deploy"
if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck source=/dev/null
  . "$ENV_FILE"
  set +a
fi

# ---------- Helpers ---------------------------------------------------------
log()  { printf "\n\033[1;34m[deploy]\033[0m %s\n" "$*"; }
warn() { printf "\n\033[1;33m[deploy] %s\033[0m\n" "$*" >&2; }
fail() { printf "\n\033[1;31m[deploy] %s\033[0m\n" "$*" >&2; exit 1; }

require_cmd() { command -v "$1" >/dev/null 2>&1 || fail "$1 is not installed"; }

# ---------- Prerequisites ---------------------------------------------------
require_cmd git
require_cmd node
require_cmd npm
require_cmd pm2
command -v serve >/dev/null 2>&1 || {
  warn "'serve' not found globally — installing (sudo npm i -g serve)"
  sudo npm install -g serve
}

: "${GITHUB_USERNAME:?Set GITHUB_USERNAME in env or .env.deploy}"
: "${GITHUB_TOKEN:?Set GITHUB_TOKEN in env or .env.deploy}"

# Credentialed URL (used only during fetch; stripped afterwards).
AUTH_URL="https://${GITHUB_USERNAME}:${GITHUB_TOKEN}@github.com/${REPO_OWNER}/${REPO_NAME}.git"
CLEAN_URL="https://github.com/${REPO_OWNER}/${REPO_NAME}.git"

# ---------- Clone or pull ---------------------------------------------------
if [[ ! -d "$APP_DIR/.git" ]]; then
  log "First-time clone → $APP_DIR (branch: $BRANCH)"
  sudo mkdir -p "$(dirname "$APP_DIR")"
  sudo chown -R "$USER":"$USER" "$(dirname "$APP_DIR")"
  git clone --branch "$BRANCH" --depth 1 "$AUTH_URL" "$APP_DIR"
else
  log "Pulling latest from origin/$BRANCH"
  cd "$APP_DIR"
  git remote set-url origin "$AUTH_URL"
  git fetch --depth 1 origin "$BRANCH"
  git reset --hard "origin/$BRANCH"
  git clean -fd
fi

cd "$APP_DIR"
# Remove the token from .git/config so it doesn't sit on disk between runs.
git remote set-url origin "$CLEAN_URL"

# ---------- Install + build -------------------------------------------------
LOCK_HASH_FILE=".deploy-lock-hash"
NEW_HASH=$(sha256sum package-lock.json | awk '{print $1}')
if [[ -f "$LOCK_HASH_FILE" && "$(cat "$LOCK_HASH_FILE")" == "$NEW_HASH" ]]; then
  log "Lockfile unchanged — skipping npm ci"
else
  log "Installing dependencies (npm install)"
  npm install --no-audit --no-fund
  echo "$NEW_HASH" > "$LOCK_HASH_FILE"
fi

log "Building production bundle"
npm run build

[[ -f dist/index.html ]] || fail "Build did not produce dist/index.html"

# ---------- pm2 -------------------------------------------------------------
export PORT
if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  log "Reloading pm2 process: $APP_NAME"
  pm2 reload ecosystem.config.cjs --update-env
else
  log "Starting pm2 process: $APP_NAME"
  pm2 start ecosystem.config.cjs
fi

pm2 save

log "Deployed. $APP_NAME is serving on http://127.0.0.1:${PORT}"
pm2 status "$APP_NAME" || true
