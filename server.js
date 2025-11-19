import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';
import rateLimit from 'express-rate-limit';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const SFS_BASE_PATH = process.env.SFS_BASE_PATH || '/home/garet/SFS';

// Middleware
app.use(express.json());
app.use(express.static(join(__dirname, 'dist')));

// CORS for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

// Repository list
const REPOS = [
  'SmartFlowSite',
  'sfs-marketing-and-growth',
  'SFSDataQueryEngine',
  'SocialScaleBoosterAIbot',
  'SFSAPDemoCRM',
  'DataScrapeInsights',
  'SocialScaleBooster',
  'Barber-booker-tempate-v1',
  'WebsiteBuilder',
  'codegpt',
  'sfs-core-services',
  'sfs-white-label-dashboard',
  'sfs-analytics-engine',
  'sfs-marketing-toolkit',
  'sfs-project-manager',
  'sfs-invoice-billing',
  'sfs-business-suite',
  'sfs-video-platform',
  'sfs-knowledge-base',
  'sfs-comms-hub',
  'sfs-embed-sdk',
  'sfs-url-shortener',
  'SFSPersonalVPN',
  'AICompanionBot',
  'sfs-brand-assets',
  'demo-repository'
];

// Get repository health
app.get('/api/repos/health', async (req, res) => {
  try {
    const repoHealth = await Promise.all(
      REPOS.map(async (name) => {
        const path = join(SFS_BASE_PATH, name);
        try {
          await fs.access(path);
          const gitPath = join(path, '.git');
          try {
            await fs.access(gitPath);
            return {
              name,
              status: 'healthy',
              path,
              hasGit: true
            };
          } catch {
            return {
              name,
              status: 'no-git',
              path,
              hasGit: false
            };
          }
        } catch {
          return {
            name,
            status: 'missing',
            path,
            hasGit: false
          };
        }
      })
    );

    res.json(repoHealth);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get system stats
app.get('/api/stats', async (req, res) => {
  try {
    const repoHealth = await Promise.all(
      REPOS.map(async (name) => {
        const path = join(SFS_BASE_PATH, name);
        try {
          await fs.access(path);
          const gitPath = join(path, '.git');
          try {
            await fs.access(gitPath);
            return 'healthy';
          } catch {
            return 'no-git';
          }
        } catch {
          return 'missing';
        }
      })
    );

    const healthy = repoHealth.filter(s => s === 'healthy').length;
    const missing = repoHealth.filter(s => s === 'missing').length;
    const noGit = repoHealth.filter(s => s === 'no-git').length;

    res.json({
      total: REPOS.length,
      healthy,
      missing,
      noGit,
      prodReady: 8, // TODO: Make dynamic
      inDev: 3,     // TODO: Make dynamic
      agentsActive: 0 // TODO: Connect to agent system
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fallback to serve React app (rate limited)
const reactFallbackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});
app.get('*', reactFallbackLimiter, (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🎯 SFS Control Tower API running on http://0.0.0.0:${PORT}`);
  console.log(`📊 Monitoring ${REPOS.length} repositories in ${SFS_BASE_PATH}`);
});
