# 🎯 SFS Control Tower - Quick Reference Card

## Start Command (One-Liner)

```bash
cd /home/garet/SFS/sfs-control-tower && npm run dev:server &
npm run dev
```

---

## Essential Commands

### Development
```bash
npm run dev              # Frontend (port 5000)
npm run dev:server       # API server (port 3000)
npm run build            # Production build
```

### Testing
```bash
npm run health           # Health check script
npm run check-repos      # Check all repos
npm run agent health     # Agent health check
```

---

## API Endpoints Cheat Sheet

### Core
```bash
GET /health                     # Server health
GET /api/stats                  # System stats
GET /api/repos/health           # All repos + GitHub data
```

### Repository Details
```bash
GET /api/repos/:name            # Specific repo details
GET /api/repos/:name/issues     # Open issues/PRs
GET /api/repos/:name/workflows  # CI/CD runs
```

### Example Usage
```bash
# Quick test
curl http://localhost:3000/health

# Get all repo data
curl http://localhost:3000/api/repos/health | jq '.[] | {name, status, openPRs: .github.openPRs}'

# Check specific repo
curl http://localhost:3000/api/repos/SmartFlowSite | jq
```

---

## Environment Variables

```bash
# Required for GitHub features
SFS_PAT=your_github_token

# Optional customization
PORT=3000
SFS_BASE_PATH=/home/garet/SFS
NODE_ENV=development
```

---

## Repository Status

| Status | Count | Meaning |
|--------|-------|---------|
| Healthy | 11 | Local clone with .git |
| Missing | 15 | On GitHub, not local |
| No-Git | 0 | Local folder, no .git |

---

## Access Points

- **Frontend:** http://localhost:5000
- **API:** http://localhost:3000
- **Health:** http://localhost:3000/health
- **Docs:** README.md, STARTUP_GUIDE.md

---

## GitHub Integration Status

✅ **Connected** via `SFS_PAT` (40 chars)
✅ **Rate Limit:** 5000 requests/hour
✅ **Tracking:** Issues, PRs, Workflows, Commits
✅ **Organization:** smartflow-systems
✅ **Repositories:** 26/26

---

## Troubleshooting Quick Fixes

```bash
# Port already in use
lsof -ti:3000 | xargs kill

# Restart server
pkill -f "node server.js" && npm run dev:server

# Check environment
echo $SFS_PAT | wc -c  # Should be 40-41 chars

# View server logs
npm run dev:server 2>&1 | tee server.log
```

---

## File Locations

```
/home/garet/SFS/sfs-control-tower/
├── server.js              # API server
├── src/pages/Dashboard.tsx    # Main UI
├── STARTUP_GUIDE.md       # Setup instructions
├── IMPLEMENTATION_SUMMARY.md  # Full details
└── QUICK_REFERENCE.md     # This file!
```

---

## Next Action Items

1. ✅ Start both servers
2. ✅ Open http://localhost:5000
3. ✅ View all 26 repos with GitHub data
4. 🔄 Implement repo detail modals (optional)
5. 🔄 Add real-time refresh (optional)
6. 🚀 Deploy to Replit (when ready)

---

**Updated:** November 19, 2025
**Status:** Production Ready ✅
