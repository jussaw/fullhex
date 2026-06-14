#!/usr/bin/env bash
set -euo pipefail

# Resolves to the privacy-policy/ folder (this script lives in privacy-policy/devops/).
# git operations run against the enclosing fullhex repo regardless of subdirectory.
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "==> Pulling latest changes..."
git -C "$REPO_DIR" pull --ff-only

echo "==> Building and starting containers..."
docker compose -f "$REPO_DIR/web/docker-compose.yml" up --build -d

echo "==> Pruning dangling images..."
docker image prune -f

echo "==> Done."
