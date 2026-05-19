#!/usr/bin/env bash
set -e

UPSTREAM_URL="https://github.com/paperclipai/paperclip.git"
BRANCH="custom/i18n"

echo "🔄 Syncing with upstream Paperclip..."

# Ensure upstream remote exists
if ! git remote | grep -q "^upstream$"; then
  echo "➕ Adding upstream remote..."
  git remote add upstream "$UPSTREAM_URL"
fi

git fetch upstream

# Update local main
echo "📥 Updating main from upstream..."
git checkout main
git merge upstream/main --no-edit || {
  echo "❌ Merge conflict on main. Please resolve manually."
  exit 1
}

# Push to origin main (optional, safe to keep fork in sync)
if git remote | grep -q "^origin$"; then
  git push origin main || echo "⚠️  Could not push main to origin (may be read-only or no permission)"
fi

# Merge into custom branch
echo "🔀 Merging main into $BRANCH..."
git checkout "$BRANCH"
git merge main --no-edit || {
  echo "⚠️  Merge conflict detected in $BRANCH."
  echo "   Resolve conflicts, then run:"
  echo "   git add . && git commit && git push origin $BRANCH"
  exit 1
}

echo "✅ Sync complete! You are on: $BRANCH"
