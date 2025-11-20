# 🚀 SFS Control Tower - Quick Startup Guide

## First-Time Setup

### 1. Install Dependencies
```bash
cd /home/garet/SFS/sfs-control-tower
npm install
```

### 2. Configure Environment
Create a `.env` file in the project root:
```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your GitHub token
nano .env
```

Add your `SFS_PAT` (GitHub Personal Access Token):
```bash
SFS_PAT=ghp_your_actual_token_here
```

**Important:** The token is currently in your Replit secrets. You'll need to add it to this `.env` file for local development.

### 3. Start the System

You need **TWO terminals** running simultaneously:

**Terminal 1 - API Server (Port 3000):**
```bash
npm run dev:server
```

**Terminal 2 - Frontend (Port 5000):**
```bash
npm run dev
```

### 4. Access the Dashboard
Open your browser to: **http://localhost:5000**

---

## What You'll See

### Without GitHub Token
- ✅ Local repo health checks (11/26 repos detected)
- ❌ No GitHub data (issues, PRs, workflows)
- ⚠️ Limited functionality

### With GitHub Token
- ✅ Full local repo health monitoring
- ✅ GitHub repo data (commits, issues, PRs)
- ✅ CI/CD workflow status
- ✅ Repository metrics (stars, language, last updated)
- 🚀 Complete Control Tower experience!

---

## API Testing

Once both servers are running, test the API:

### Check Server Health
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{"ok":true,"timestamp":"2025-11-19T..."}
```

### Get All Repos Health
```bash
curl http://localhost:3000/api/repos/health | jq
```

### Get System Stats
```bash
curl http://localhost:3000/api/stats | jq
```

### Get Specific Repo Info
```bash
curl http://localhost:3000/api/repos/SmartFlowSite | jq
```

### Get Issues for a Repo
```bash
curl http://localhost:3000/api/repos/SmartFlowSite/issues | jq
```

---

## Troubleshooting

### "Cannot connect to API"
- Make sure `npm run dev:server` is running on port 3000
- Check CORS is enabled in server.js

### "No GitHub data showing"
- Verify `SFS_PAT` is set in `.env`
- Check token has correct permissions (repo, read:org, workflow)
- Restart the API server after adding the token

### "Port already in use"
- Kill existing processes: `lsof -ti:3000 | xargs kill`
- Or change port in `.env`: `PORT=3001`

### "Repos showing as 'missing'"
- Verify `SFS_BASE_PATH` in `.env` points to correct directory
- Default: `/home/garet/SFS`

---

## Development Workflow

### Making Changes

**Backend changes (server.js):**
1. Edit `server.js`
2. Restart with `npm run dev:server`

**Frontend changes (src/):**
1. Edit files in `src/`
2. Vite will auto-reload (no restart needed)

### Running Agent Commands

```bash
# Check all repos health
npm run check-repos

# Agent CLI interface
npm run agent health
npm run agent status
```

---

## Next Steps After Setup

1. **Verify GitHub Integration**
   - Add your `SFS_PAT` to `.env`
   - Restart API server
   - Check dashboard shows GitHub data

2. **Explore the Dashboard**
   - View all 26 repos at a glance
   - Click repos for detailed info
   - Check CI/CD workflow statuses

3. **Test Agent Commands**
   - Try `npm run agent health`
   - Explore other agent capabilities

4. **Deploy to Replit** (when ready)
   - Push to GitHub
   - Import in Replit
   - Add secrets (SFS_PAT, REPLIT_TOKEN)
   - Run with `npm start`

---

## File Structure Quick Reference

```
sfs-control-tower/
├── server.js              # Express API (port 3000)
├── src/
│   ├── pages/
│   │   └── Dashboard.tsx  # Main dashboard UI
│   ├── components/        # React components
│   └── types/             # TypeScript types
├── scripts/               # CLI tools
├── .env                   # Your local config (add this!)
└── .env.example          # Template
```

---

## Support

Questions? Issues? Check:
- `README.md` - Full documentation
- `AGENTS.md` - AI assistant guide
- GitHub Issues - Report problems

---

**Built with ❤️ by SmartFlow Systems**
