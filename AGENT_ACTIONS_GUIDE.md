# 🤖 Agent Actions Guide

**SFS Control Tower - Automated Operations**

## Overview

The Agent Actions system provides one-click automation for managing all 26 SFS repositories from a central dashboard.

---

## Available Actions

### 1. 🔍 Health Check

**Endpoint:** `POST /api/agents/health-check`

**What it does:**
- Checks if all 26 repositories exist locally
- Verifies git repository status
- Detects uncommitted changes
- Returns comprehensive health summary

**Example Response:**
```json
{
  "success": true,
  "summary": {
    "total": 26,
    "healthy": 26,
    "missing": 0,
    "noGit": 0,
    "withChanges": 5
  },
  "results": [
    {
      "name": "SmartFlowSite",
      "status": "healthy",
      "hasGit": true,
      "gitStatus": "clean",
      "path": "/home/garet/SFS/SmartFlowSite"
    }
  ]
}
```

**Use when:**
- Starting your work day
- After cloning new repos
- Before major operations
- Checking overall system health

---

### 2. 🔄 Sync All

**Endpoint:** `POST /api/agents/sync-all`

**What it does:**
- Runs `git fetch origin` on all repos
- Executes `git pull origin <current-branch>` for each
- Reports which repos were updated
- Shows which repos were already up to date

**Example Response:**
```json
{
  "success": true,
  "summary": {
    "total": 26,
    "successful": 24,
    "failed": 2,
    "updated": 5,
    "upToDate": 19
  },
  "results": [
    {
      "name": "SmartFlowSite",
      "success": true,
      "message": "Updated successfully",
      "output": "Updating abc123..def456\nFast-forward..."
    }
  ]
}
```

**Use when:**
- Starting work on multiple repos
- After team members push changes
- Before creating pull requests
- Keeping all repos synchronized

---

### 3. 🚀 Deploy All

**Endpoint:** `POST /api/agents/deploy-all`

**What it does:**
- Finds the first workflow in each repository
- Triggers workflow using GitHub Actions API
- Reports deployment status
- Shows which repos lack workflows

**Requirements:**
- `SFS_PAT` environment variable must be set
- Workflows must support `workflow_dispatch` trigger

**Example Response:**
```json
{
  "success": true,
  "summary": {
    "total": 26,
    "successful": 18,
    "failed": 3,
    "noWorkflows": 5
  },
  "results": [
    {
      "name": "SmartFlowSite",
      "success": true,
      "message": "Triggered: SFS CI/CD",
      "workflowId": 12345
    }
  ]
}
```

**Use when:**
- Deploying updates across all projects
- Testing CI/CD pipelines
- Rolling out infrastructure changes
- Emergency deployments

---

### 4. 📋 View Logs

**Endpoint:** `GET /api/agents/logs?limit=20`

**What it does:**
- Fetches recent git commits from multiple repos
- Aggregates activity across the ecosystem
- Shows author, date, and commit message
- Provides audit trail of recent work

**Example Response:**
```json
{
  "success": true,
  "total": 25,
  "logs": [
    {
      "repo": "SmartFlowSite",
      "hash": "abc123",
      "author": "boweazy",
      "date": "2 hours ago",
      "message": "feat: Add agent actions"
    }
  ]
}
```

**Use when:**
- Reviewing recent changes
- Tracking team activity
- Debugging issues
- Creating status reports

---

### 5. 🛠️ Fix Common Issues

**Endpoint:** `POST /api/agents/fix-issues`

**Actions available:**
- `npm-install` - Install/update dependencies
- `git-reset` - Reset to HEAD (discard changes)
- `clear-cache` - Clear node_modules and reinstall

**Request Body:**
```json
{
  "action": "npm-install",
  "repos": ["SmartFlowSite", "codegpt"]
}
```

**Example Response:**
```json
{
  "success": true,
  "action": "npm-install",
  "results": [
    {
      "name": "SmartFlowSite",
      "success": true,
      "message": "Dependencies installed"
    }
  ]
}
```

**Use when:**
- Dependencies are out of sync
- Build errors occur
- Need to reset repositories
- Clearing cached files

---

## Frontend Integration

### Using in React Components

```typescript
import { useState } from 'react';

const MyComponent = () => {
  const [loading, setLoading] = useState(false);

  const handleHealthCheck = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/agents/health-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      console.log('Health:', data.summary);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleHealthCheck} disabled={loading}>
      {loading ? 'Checking...' : 'Run Health Check'}
    </button>
  );
};
```

---

## CLI Usage

### Via cURL

```bash
# Health check
curl -X POST http://localhost:3000/api/agents/health-check | jq '.summary'

# Sync all repos
curl -X POST http://localhost:3000/api/agents/sync-all | jq '.summary'

# View logs
curl http://localhost:3000/api/agents/logs?limit=10 | jq '.logs[]'

# Fix issues
curl -X POST http://localhost:3000/api/agents/fix-issues \
  -H "Content-Type: application/json" \
  -d '{"action":"npm-install","repos":["SmartFlowSite"]}'
```

### Via npm scripts

```bash
# Health check (uses existing script)
npm run check-repos

# Agent CLI interface
npm run agent health
npm run agent status
```

---

## Best Practices

### 1. Health Check Before Major Operations
Always run health check before:
- Syncing all repos
- Deploying all services
- Making bulk changes

### 2. Sync Regularly
Run sync action:
- At start of work session
- Before creating PRs
- After team meetings

### 3. Deploy Selectively
For production deploys:
- Test individual repos first
- Use deploy-all for staging
- Monitor workflow status

### 4. Review Logs Frequently
Check logs to:
- Track team progress
- Identify busy repos
- Debug recent changes

### 5. Fix Issues Promptly
Use fix-issues for:
- Dependency problems
- Build failures
- Cache corruption

---

## Error Handling

### Common Errors

**GitHub API Not Configured:**
```json
{
  "success": false,
  "error": "GitHub API not configured. Set SFS_PAT in environment."
}
```

**Solution:** Set `SFS_PAT` in `.env` file

**Repository Not Found:**
```json
{
  "name": "some-repo",
  "success": false,
  "message": "Repository not found"
}
```

**Solution:** Check `/home/garet/SFS/` directory

**Git Operation Failed:**
```json
{
  "name": "some-repo",
  "success": false,
  "message": "No git repository"
}
```

**Solution:** Initialize git or clone from GitHub

---

## Performance Considerations

### Parallel Processing
- All actions run in parallel across repos
- Health check: ~1-2 seconds for 26 repos
- Sync all: ~5-10 seconds (network dependent)
- Deploy all: ~3-5 seconds (API limited)

### Rate Limiting
- GitHub API: 5000 requests/hour
- Deploy all uses ~78 requests
- Can run ~64 times per hour

### Optimization Tips
1. Use health check before expensive operations
2. Run sync-all during low-traffic times
3. Deploy selectively for large repos
4. Monitor GitHub API rate limits

---

## Security

### Required Permissions

**SFS_PAT (GitHub Token) needs:**
- `repo` - Full control of private repositories
- `workflow` - Update GitHub Action workflows
- `read:org` - Read organization data

### Best Practices
1. Never commit `.env` file
2. Use environment variables for secrets
3. Rotate tokens regularly
4. Monitor API usage
5. Restrict token permissions

---

## Troubleshooting

### Agent Actions Not Working

**Check server is running:**
```bash
curl http://localhost:3000/health
# Should return: {"ok":true}
```

**Verify SFS_PAT:**
```bash
echo $SFS_PAT | wc -c
# Should be > 40 characters
```

**Test individual endpoint:**
```bash
curl -X POST http://localhost:3000/api/agents/health-check
```

### Sync Fails for Specific Repos

**Check git status manually:**
```bash
cd /home/garet/SFS/SmartFlowSite
git status
git pull origin main
```

**Common issues:**
- Uncommitted changes blocking pull
- Diverged branches
- Network connectivity

---

## Roadmap

### Planned Features

**Phase 2 (Current Sprint):**
- [ ] Real-time WebSocket updates
- [ ] Alert system for failures
- [ ] Scheduled automatic syncs
- [ ] Batch operations UI

**Phase 3 (Future):**
- [ ] Rollback capability
- [ ] Deployment previews
- [ ] Analytics dashboard
- [ ] Multi-user support
- [ ] Custom action scripts

---

## Support

**Issues:** https://github.com/smartflow-systems/sfs-control-tower/issues

**Internal Docs:** See `README.md`, `STARTUP_GUIDE.md`

**API Reference:** All endpoints documented in `server.js`

---

**Built with:** Node.js, Express, GitHub Octokit, React

**Part of:** SmartFlow Systems Ecosystem

**Last Updated:** November 20, 2025
