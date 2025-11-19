# 🎯 SFS Control Tower

**SmartFlow Systems Operations Control Center**

![CI/CD](https://github.com/smartflow-systems/sfs-control-tower/workflows/SFS%20Control%20Tower%20CI/CD/badge.svg)
![Node](https://img.shields.io/badge/node-18+-green.svg)
![React](https://img.shields.io/badge/react-18.2-blue.svg)

## What This Is

Your central dashboard for managing all 26 SFS repositories, agents, deployments, and health checks.

## Features

- 📊 Real-time health monitoring for all repos
- 🤖 Agent orchestration interface
- 🚀 One-click deployment triggers
- 📈 System-wide analytics
- 🎨 Full SFS brown/black/gold branding

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Visit http://localhost:5000
```

## Scripts

- `npm run dev` - Start dev server (Vite)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run health` - Run health check
- `npm run check-repos` - Check all repo statuses
- `npm run agent` - Agent CLI interface

### Agent CLI Commands

```bash
# Check health of all repos
npm run agent health

# Show agent status
npm run agent status

# Sync knowledge base (coming soon)
npm run agent sync

# Deploy all services (coming soon)
npm run agent deploy
```

## Architecture

### Frontend Stack
- **React 18** - UI framework
- **TypeScript 5** - Type safety
- **Vite 5** - Build tool
- **Tailwind CSS 3** - Styling with SFS theme
- **Radix UI** - Accessible components
- **Recharts** - Data visualization

### Backend (Coming Soon)
- **Express** - API server
- **Axios** - HTTP client

### Theme Colors
```js
{
  'sfs-black': '#0D0D0D',
  'sfs-brown': '#3B2F2F',
  'sfs-gold': '#FFD700',
  'sfs-gold-hover': '#E6C200',
  'sfs-beige': '#F5F5DC'
}
```

## Project Structure

```
sfs-control-tower/
├── src/
│   ├── components/          # React components
│   │   ├── RepoGrid.tsx    # Repository grid display
│   │   ├── AgentPanel.tsx  # Agent control panel
│   │   └── HealthStatus.tsx # System health overview
│   ├── pages/
│   │   └── Dashboard.tsx   # Main dashboard page
│   ├── services/           # API clients (coming)
│   ├── types/              # TypeScript types
│   └── utils/              # Helper functions
├── scripts/
│   ├── health.js           # Health check script
│   ├── check-repos.js      # Repo status checker
│   └── agent-cli.js        # Agent CLI interface
├── .github/workflows/
│   └── sfs-ci-deploy.yml   # CI/CD pipeline
└── public/                 # Static assets
```

## Managed Repositories (26)

### Core Platform
- SmartFlowSite
- sfs-core-services
- sfs-white-label-dashboard

### Data & Analytics
- SFSDataQueryEngine
- DataScrapeInsights
- sfs-analytics-engine

### Social & Marketing
- SocialScaleBooster
- SocialScaleBoosterAIbot
- sfs-marketing-and-growth
- sfs-marketing-toolkit

### Business Management
- SFSAPDemoCRM
- Barber-booker-tempate-v1
- sfs-project-manager
- sfs-invoice-billing
- sfs-business-suite

### Content & Media
- sfs-video-platform
- sfs-knowledge-base
- sfs-comms-hub

### Developer Tools
- codegpt
- sfs-embed-sdk
- sfs-url-shortener
- SFSPersonalVPN

### AI & Automation
- AICompanionBot

### Branding
- sfs-brand-assets

### Demo/Testing
- demo-repository
- WebsiteBuilder

## Development

### Requirements
- Node.js 18+
- npm 9+

### Environment Variables
Create `.env.local`:
```bash
VITE_API_URL=http://localhost:3000
VITE_SFS_PAT=your_github_token
```

### Local Development
```bash
# Install dependencies
npm install

# Start dev server with hot reload
npm run dev

# In another terminal, check repo health
npm run check-repos
```

## Deployment

Configured for Replit with GitHub Actions CI/CD.

### Replit Setup
1. Import from GitHub
2. Set environment variables
3. Run `npm install`
4. Start with `npm run dev`

### CI/CD Pipeline
- Runs on push to `main`
- Builds TypeScript + React
- Runs health checks
- Deploys to Replit (when configured)

## Roadmap

### Phase 1 - Dashboard (Current)
- [x] Project scaffold
- [x] Basic UI components
- [x] Repo health checking
- [x] Agent CLI interface
- [ ] API backend

### Phase 2 - Integration
- [ ] Real-time repo health monitoring
- [ ] GitHub API integration
- [ ] Deployment automation
- [ ] Agent orchestration

### Phase 3 - Advanced Features
- [ ] Analytics dashboard
- [ ] Alert system
- [ ] Multi-user support
- [ ] Advanced automation

## Contributing

Part of SmartFlow Systems internal tooling.

## License

MIT

---

**Part of SmartFlow Systems** | Built by boweazy (Gareth)

**Organization:** [smartflow-systems](https://github.com/smartflow-systems)
