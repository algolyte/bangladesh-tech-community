#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="${REPO_DIR:-/srv/bangladesh-tech-community}"
BRANCH="${BRANCH:-main}"

cd "$REPO_DIR"
git pull origin "$BRANCH"
npm ci
npm run sync
npm run build:web

echo "Static output available in $REPO_DIR/out"
