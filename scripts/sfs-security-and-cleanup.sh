#!/bin/bash
set -euo pipefail

# SFS Control Tower - Security & Branch Cleanup Script
# Handles security fixes, dependency updates, and branch cleanup across all SFS repos

GITHUB_ORG="smartflow-systems"
SFS_BASE="/home/garet/SFS"

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🎯 SFS Control Tower - Security & Cleanup Automation${NC}"
echo "=================================================="
echo ""

# All public repos that need security fixes
PUBLIC_REPOS=(
  "SmartFlowSite"
  "sfs-marketing-and-growth"
  "SFSDataQueryEngine"
  "SocialScaleBoosterAIbot"
  "SFSAPDemoCRM"
  "DataScrapeInsights"
  "SocialScaleBooster"
  "Barber-booker-tempate-v1"
  "sfs-control-tower"
  "AICompanionBot"
  "SFSPersonalVPN"
  "codegpt"
)

# Function to fix esbuild security vulnerability
fix_esbuild_vulnerability() {
  local repo=$1
  echo -e "${YELLOW}Fixing esbuild vulnerability in $repo${NC}"

  cd "$SFS_BASE/$repo"

  # Check if package.json exists
  if [ ! -f "package.json" ]; then
    echo "  ⚠️  No package.json found, skipping"
    return
  fi

  # Check if esbuild is a dependency
  if ! grep -q "esbuild" package.json; then
    echo "  ℹ️  No esbuild dependency, skipping"
    return
  fi

  # Update esbuild to latest secure version
  echo "  🔧 Updating esbuild to latest version..."
  npm install esbuild@latest --save-dev 2>/dev/null || true

  # Check if there are changes
  if git diff --quiet package.json package-lock.json; then
    echo "  ✅ Already up to date"
  else
    echo "  📝 Creating fix commit..."
    git add package.json package-lock.json
    git commit -m "security: update esbuild to latest version

Fixes Dependabot alert: esbuild enables any website to send any requests
to the development server and read the response

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
    echo "  ✅ Committed security fix"
  fi
}

# Function to update all dependencies
update_dependencies() {
  local repo=$1
  echo -e "${YELLOW}Updating dependencies in $repo${NC}"

  cd "$SFS_BASE/$repo"

  if [ -f "package.json" ]; then
    echo "  📦 Running npm update..."
    npm update 2>/dev/null || echo "  ⚠️  npm update had warnings"
    npm audit fix 2>/dev/null || echo "  ⚠️  Some vulnerabilities require manual review"

    if ! git diff --quiet package.json package-lock.json 2>/dev/null; then
      git add package.json package-lock.json
      git commit -m "chore(deps): update npm dependencies

Automated dependency updates and security fixes

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>" || true
      echo "  ✅ Dependencies updated"
    else
      echo "  ✅ Dependencies already up to date"
    fi
  fi

  if [ -f "requirements.txt" ]; then
    echo "  🐍 Python dependencies found"
    echo "  ℹ️  Python dependency updates require manual review"
  fi
}

# Function to clean up merged branches
cleanup_branches() {
  local repo=$1
  echo -e "${YELLOW}Cleaning up branches in $repo${NC}"

  cd "$SFS_BASE/$repo"

  # Fetch all branches
  git fetch --prune origin 2>/dev/null || true

  # Get default branch (main or master)
  default_branch=$(git remote show origin | grep 'HEAD branch' | cut -d' ' -f5)

  # Ensure we're on default branch
  git checkout "$default_branch" 2>/dev/null || true
  git pull origin "$default_branch" 2>/dev/null || true

  # List branches merged into default
  merged_branches=$(git branch --merged "$default_branch" | grep -v "^\*" | grep -v "$default_branch" || true)

  if [ -z "$merged_branches" ]; then
    echo "  ✅ No merged branches to clean up"
  else
    echo "  🗑️  Deleting merged local branches:"
    echo "$merged_branches" | while read branch; do
      echo "    - $branch"
      git branch -d "$branch" 2>/dev/null || true
    done
    echo "  ✅ Local merged branches deleted"
  fi

  # List remote branches that are merged
  echo "  📡 Checking remote merged branches..."
  remote_merged=$(git branch -r --merged "$default_branch" | grep -v "$default_branch" | grep -v "HEAD" | sed 's/origin\///' || true)

  if [ -n "$remote_merged" ]; then
    echo "  ℹ️  Found merged remote branches (delete manually if needed):"
    echo "$remote_merged" | while read branch; do
      echo "    - origin/$branch"
    done
  fi
}

# Function to process a repository
process_repo() {
  local repo=$1

  echo -e "\n${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${GREEN}Processing: $repo${NC}"
  echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

  if [ ! -d "$SFS_BASE/$repo" ]; then
    echo -e "${RED}✗ Repository not found locally, skipping${NC}"
    return
  fi

  # Fix security vulnerabilities
  fix_esbuild_vulnerability "$repo"

  # Update dependencies
  update_dependencies "$repo"

  # Clean up branches
  cleanup_branches "$repo"

  # Push changes if any
  cd "$SFS_BASE/$repo"
  if ! git diff --quiet origin/$(git rev-parse --abbrev-ref HEAD) 2>/dev/null; then
    echo -e "${BLUE}  📤 Pushing changes to GitHub...${NC}"
    git push origin $(git rev-parse --abbrev-ref HEAD) 2>/dev/null && echo -e "${GREEN}  ✅ Pushed successfully${NC}" || echo -e "${RED}  ✗ Push failed${NC}"
  else
    echo "  ℹ️  No changes to push"
  fi

  echo ""
}

# Main execution
echo "📋 Processing ${#PUBLIC_REPOS[@]} repositories..."
echo ""

for repo in "${PUBLIC_REPOS[@]}"; do
  process_repo "$repo"
done

echo -e "\n${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 Cleanup Complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Generate summary
echo "📊 Summary Report:"
echo "==================="
echo ""

cd "$SFS_BASE"
for repo in "${PUBLIC_REPOS[@]}"; do
  if [ -d "$repo" ]; then
    cd "$repo"
    default_branch=$(git remote show origin 2>/dev/null | grep 'HEAD branch' | cut -d' ' -f5 || echo "main")
    status=$(git status --porcelain 2>/dev/null | wc -l)
    ahead=$(git rev-list origin/$default_branch..$default_branch --count 2>/dev/null || echo "0")

    if [ "$status" -eq 0 ] && [ "$ahead" -eq 0 ]; then
      echo -e "✅ $repo - Clean"
    else
      echo -e "⚠️  $repo - Has uncommitted changes or unpushed commits"
    fi
    cd "$SFS_BASE"
  fi
done

echo ""
echo "🔍 For detailed security alerts, visit:"
echo "https://github.com/smartflow-systems"
echo ""
