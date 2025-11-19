# 🎯 SFS Control Tower - AI Agent Guidelines

**Project:** SFS Control Tower
**Purpose:** Central operations dashboard for SmartFlow Systems ecosystem
**Owner:** boweazy (Gareth)
**GitHub:** smartflow-systems/sfs-control-tower

---

## What This Project Does

The SFS Control Tower is a React-based dashboard that monitors and manages all 26 SmartFlow Systems repositories. It provides:

- Real-time health monitoring of all repos
- Agent orchestration interface
- System-wide analytics
- Deployment automation (planned)

---

## File Paths Reference

Use brackets `[path/to/file]` when mentioning files:

**Configuration:**
- `[package.json]` - npm configuration
- `[tsconfig.json]` - TypeScript config
- `[vite.config.ts]` - Vite build config
- `[tailwind.config.js]` - Tailwind + SFS theme
- `[.env.example]` - Environment template

**Source Code:**
- `[src/App.tsx]` - Main app component
- `[src/pages/Dashboard.tsx]` - Main dashboard page
- `[src/components/RepoGrid.tsx]` - Repository grid display
- `[src/components/AgentPanel.tsx]` - Agent control panel
- `[src/components/HealthStatus.tsx]` - System health overview
- `[src/types/repo.ts]` - TypeScript type definitions

**Backend:**
- `[server.js]` - Express API server
- `/api/repos/health` - Repo health endpoint
- `/api/stats` - System stats endpoint

**Scripts:**
- `[scripts/health.cjs]` - Health check script
- `[scripts/check-repos.cjs]` - Repo status checker
- `[scripts/agent-cli.cjs]` - Agent CLI

**CI/CD:**
- `[.github/workflows/sfs-ci-deploy.yml]` - GitHub Actions workflow

---

## Common Tasks

### Running the Project

**Development (frontend only):**
```bash
npm run dev
# Vite dev server on http://localhost:5000
```

**Development (with backend):**
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
npm run dev:server
# API on http://localhost:3000
```

**Production:**
```bash
npm run build    # Build frontend
npm start        # Start Express server
```

**Health Checks:**
```bash
npm run check-repos  # Check all 26 repos
npm run health       # Health check endpoint
npm run agent health # Agent CLI health
```

### Making Changes

**Adding a new component:**
1. Create `[src/components/NewComponent.tsx]`
2. Import in `[src/pages/Dashboard.tsx]`
3. Follow SFS theme colors (brown/black/gold)

**Adding a new API endpoint:**
1. Edit `[server.js]`
2. Add route handler
3. Update `[src/types/repo.ts]` if needed

**Updating scripts:**
1. Edit files in `[scripts/]` directory
2. Use `.cjs` extension for CommonJS
3. Update `[package.json]` scripts if needed

---

## SFS Theme Standards

**Colors (Tailwind classes):**
- `bg-sfs-black` - #0D0D0D (primary background)
- `bg-sfs-brown` - #3B2F2F (secondary background)
- `text-sfs-gold` - #FFD700 (primary accent)
- `bg-sfs-gold-hover` - #E6C200 (hover state)
- `text-sfs-beige` - #F5F5DC (text)

**Component Pattern:**
```tsx
<div className="bg-sfs-brown/50 rounded-lg p-6 border border-sfs-gold/20">
  <h2 className="text-sfs-gold font-bold">Title</h2>
  <p className="text-sfs-beige/70">Content</p>
</div>
```

---

## Repository List (26 Total)

The dashboard monitors these repos in `/home/garet/SFS/`:

**Core Platform:**
- SmartFlowSite
- sfs-core-services
- sfs-white-label-dashboard

**Data & Analytics:**
- SFSDataQueryEngine
- DataScrapeInsights
- sfs-analytics-engine

**Social & Marketing:**
- SocialScaleBooster
- SocialScaleBoosterAIbot
- sfs-marketing-and-growth
- sfs-marketing-toolkit

**Business Management:**
- SFSAPDemoCRM
- Barber-booker-tempate-v1
- sfs-project-manager
- sfs-invoice-billing
- sfs-business-suite

**Content & Media:**
- sfs-video-platform
- sfs-knowledge-base
- sfs-comms-hub

**Developer Tools:**
- codegpt
- sfs-embed-sdk
- sfs-url-shortener
- SFSPersonalVPN

**AI & Automation:**
- AICompanionBot

**Branding:**
- sfs-brand-assets

**Demo/Testing:**
- demo-repository
- WebsiteBuilder

---

## Before Making Changes

### VERIFY
Always check current state before destructive operations:
```bash
git status          # Check uncommitted changes
npm run build       # Verify build works
npm run check-repos # Check repo health
```

### UNDO
If you need to undo changes:
```bash
git stash           # Stash uncommitted changes
git reset --hard    # Reset to last commit
npm ci              # Clean install dependencies
```

---

## Architecture Notes

**Frontend:**
- React 18 with TypeScript
- Vite 5 for bundling
- Tailwind CSS for styling
- Radix UI for components

**Backend:**
- Express.js API
- File system scanning for repo health
- ES modules (`"type": "module"`)

**Scripts:**
- CommonJS (`.cjs` extension)
- Use `require()` syntax

---

## Deployment

**GitHub Actions:**
- Runs on push to `main`
- Builds TypeScript + React
- Runs health checks
- Deploys to Replit (when configured)

**Replit:**
- Environment: Node.js 18+
- Entry point: `npm start` or `npm run dev`
- Port: 3000 (backend) or 5000 (frontend)

---

## Development Guidelines

1. **Always use TypeScript types** from `[src/types/repo.ts]`
2. **Follow SFS theme** - brown/black/gold palette
3. **Test locally** before pushing
4. **Update README.md** if adding features
5. **Commit frequently** with clear messages
6. **Use ES modules** for new JavaScript files

---

## Common Issues

**Build fails:**
- Check for unused imports (TypeScript strict mode)
- Verify all dependencies installed: `npm ci`
- Check `[tsconfig.json]` settings

**Scripts fail:**
- Ensure `.cjs` extension for CommonJS
- Check `"type": "module"` in `[package.json]`
- Verify file paths are correct

**API not working:**
- Check `SFS_BASE_PATH` environment variable
- Verify Express server is running: `npm run dev:server`
- Check CORS settings in `[server.js]`

---

## Future Enhancements

**Phase 2 (Planned):**
- Real-time WebSocket updates
- GitHub API integration
- Automated deployment triggers
- Multi-user authentication

**Phase 3 (Planned):**
- Advanced analytics dashboard
- Alert system for repo issues
- Agent orchestration automation
- CI/CD status monitoring

---

**Questions?** Check `[README.md]` or the SFS ecosystem documentation in `/home/garet/.claude/CLAUDE.md`

**Last Updated:** 2025-11-19
