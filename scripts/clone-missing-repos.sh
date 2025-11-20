#!/bin/bash
set -euo pipefail

# SFS Control Tower - Clone Missing Repositories
# This script clones all repos that exist on GitHub but not locally

GITHUB_ORG="smartflow-systems"
SFS_BASE="/home/garet/SFS"
MISSING_REPOS=(
  "sfs-core-services"
  "sfs-white-label-dashboard"
  "sfs-analytics-engine"
  "sfs-marketing-toolkit"
  "sfs-project-manager"
  "sfs-invoice-billing"
  "sfs-business-suite"
  "sfs-video-platform"
  "sfs-knowledge-base"
  "sfs-comms-hub"
  "sfs-embed-sdk"
  "sfs-url-shortener"
  "AICompanionBot"
  "sfs-brand-assets"
  "demo-repository"
)

echo "🎯 SFS Control Tower - Cloning Missing Repositories"
echo "📁 Target directory: $SFS_BASE"
echo "📦 Repos to clone: ${#MISSING_REPOS[@]}"
echo ""

cd "$SFS_BASE"

for repo in "${MISSING_REPOS[@]}"; do
  echo "=== Cloning $repo ==="

  if [ -d "$repo" ]; then
    echo "⚠️  Directory already exists, skipping..."
  else
    if gh repo clone "$GITHUB_ORG/$repo" "$repo"; then
      echo "✅ Successfully cloned $repo"
    else
      echo "❌ Failed to clone $repo (might be private or not exist)"
    fi
  fi

  echo ""
done

echo "🎉 Clone operation complete!"
echo ""
echo "📊 Summary:"
ls -d */ | wc -l | xargs echo "Total repos in $SFS_BASE:"
