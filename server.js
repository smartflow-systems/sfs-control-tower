import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';
import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';
import { exec } from 'child_process';
import { promisify } from 'util';

dotenv.config();

const execPromise = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const SFS_BASE_PATH = process.env.SFS_BASE_PATH || '/home/garet/SFS';
const GITHUB_TOKEN = process.env.SFS_PAT || process.env.GITHUB_TOKEN;
const GITHUB_ORG = 'smartflow-systems';

// Initialize Octokit (GitHub API client)
const octokit = GITHUB_TOKEN ? new Octokit({ auth: GITHUB_TOKEN }) : null;

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

// Helper function to fetch GitHub repo data
async function getGitHubRepoData(repoName) {
  if (!octokit) {
    return null;
  }

  try {
    const { data: repo } = await octokit.repos.get({
      owner: GITHUB_ORG,
      repo: repoName,
    });

    // Get latest commit
    const { data: commits } = await octokit.repos.listCommits({
      owner: GITHUB_ORG,
      repo: repoName,
      per_page: 1,
    });

    // Get open issues and PRs
    const { data: issues } = await octokit.issues.listForRepo({
      owner: GITHUB_ORG,
      repo: repoName,
      state: 'open',
    });

    const openPRs = issues.filter(issue => issue.pull_request);
    const openIssues = issues.filter(issue => !issue.pull_request);

    // Get workflow runs (CI/CD status)
    let workflowStatus = null;
    try {
      const { data: workflows } = await octokit.actions.listWorkflowRunsForRepo({
        owner: GITHUB_ORG,
        repo: repoName,
        per_page: 1,
      });
      if (workflows.workflow_runs.length > 0) {
        workflowStatus = workflows.workflow_runs[0].conclusion;
      }
    } catch (err) {
      // Workflow API might not be accessible
      console.log(`No workflow data for ${repoName}`);
    }

    return {
      description: repo.description,
      stars: repo.stargazers_count,
      lastCommit: commits[0] ? {
        message: commits[0].commit.message,
        date: commits[0].commit.author.date,
        author: commits[0].commit.author.name,
      } : null,
      openIssues: openIssues.length,
      openPRs: openPRs.length,
      defaultBranch: repo.default_branch,
      isPrivate: repo.private,
      workflowStatus,
      language: repo.language,
      updatedAt: repo.updated_at,
    };
  } catch (error) {
    console.error(`GitHub API error for ${repoName}:`, error.message);
    return null;
  }
}

// Get repository health
app.get('/api/repos/health', async (req, res) => {
  try {
    const repoHealth = await Promise.all(
      REPOS.map(async (name) => {
        const path = join(SFS_BASE_PATH, name);
        let localStatus = 'missing';
        let hasGit = false;

        // Check local file system
        try {
          await fs.access(path);
          const gitPath = join(path, '.git');
          try {
            await fs.access(gitPath);
            localStatus = 'healthy';
            hasGit = true;
          } catch {
            localStatus = 'no-git';
            hasGit = false;
          }
        } catch {
          localStatus = 'missing';
        }

        // Fetch GitHub data (if token is available)
        const githubData = await getGitHubRepoData(name);

        return {
          name,
          status: localStatus,
          path,
          hasGit,
          github: githubData,
        };
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
      agentsActive: 0, // TODO: Connect to agent system
      githubConnected: !!octokit,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get detailed info for a specific repo
app.get('/api/repos/:name', async (req, res) => {
  try {
    const { name } = req.params;

    if (!REPOS.includes(name)) {
      return res.status(404).json({ error: 'Repository not found' });
    }

    const path = join(SFS_BASE_PATH, name);
    let localStatus = 'missing';
    let hasGit = false;

    // Check local status
    try {
      await fs.access(path);
      const gitPath = join(path, '.git');
      try {
        await fs.access(gitPath);
        localStatus = 'healthy';
        hasGit = true;
      } catch {
        localStatus = 'no-git';
      }
    } catch {
      localStatus = 'missing';
    }

    // Get GitHub data
    const githubData = await getGitHubRepoData(name);

    res.json({
      name,
      status: localStatus,
      path,
      hasGit,
      github: githubData,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get issues for a specific repo
app.get('/api/repos/:name/issues', async (req, res) => {
  try {
    const { name } = req.params;

    if (!REPOS.includes(name)) {
      return res.status(404).json({ error: 'Repository not found' });
    }

    if (!octokit) {
      return res.status(503).json({ error: 'GitHub API not configured' });
    }

    const { data: issues } = await octokit.issues.listForRepo({
      owner: GITHUB_ORG,
      repo: name,
      state: 'open',
    });

    res.json(issues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get workflow runs for a specific repo
app.get('/api/repos/:name/workflows', async (req, res) => {
  try {
    const { name } = req.params;

    if (!REPOS.includes(name)) {
      return res.status(404).json({ error: 'Repository not found' });
    }

    if (!octokit) {
      return res.status(503).json({ error: 'GitHub API not configured' });
    }

    const { data: workflows } = await octokit.actions.listWorkflowRunsForRepo({
      owner: GITHUB_ORG,
      repo: name,
      per_page: 10,
    });

    res.json(workflows.workflow_runs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== AGENT ACTION ENDPOINTS ====================

// Agent Action: Health Check All
app.post('/api/agents/health-check', async (req, res) => {
  try {
    console.log('🔍 Running health check on all repositories...');

    const results = await Promise.all(
      REPOS.map(async (name) => {
        const path = join(SFS_BASE_PATH, name);
        let status = 'missing';
        let hasGit = false;
        let gitStatus = null;

        try {
          await fs.access(path);
          const gitPath = join(path, '.git');

          try {
            await fs.access(gitPath);
            hasGit = true;
            status = 'healthy';

            // Get git status
            try {
              const { stdout } = await execPromise('git status --porcelain', { cwd: path });
              const hasChanges = stdout.trim().length > 0;
              gitStatus = hasChanges ? 'uncommitted-changes' : 'clean';
            } catch (err) {
              gitStatus = 'error';
            }
          } catch {
            status = 'no-git';
          }
        } catch {
          status = 'missing';
        }

        return { name, status, hasGit, gitStatus, path };
      })
    );

    const summary = {
      total: results.length,
      healthy: results.filter(r => r.status === 'healthy').length,
      missing: results.filter(r => r.status === 'missing').length,
      noGit: results.filter(r => r.status === 'no-git').length,
      withChanges: results.filter(r => r.gitStatus === 'uncommitted-changes').length,
    };

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      summary,
      results,
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Agent Action: Sync All (git pull)
app.post('/api/agents/sync-all', async (req, res) => {
  try {
    console.log('🔄 Syncing all repositories...');

    const results = await Promise.all(
      REPOS.map(async (name) => {
        const path = join(SFS_BASE_PATH, name);
        let success = false;
        let message = '';
        let output = '';

        try {
          await fs.access(path);
          const gitPath = join(path, '.git');

          try {
            await fs.access(gitPath);

            // Fetch latest
            const fetchResult = await execPromise('git fetch origin', { cwd: path });

            // Get current branch
            const { stdout: branchOut } = await execPromise('git rev-parse --abbrev-ref HEAD', { cwd: path });
            const currentBranch = branchOut.trim();

            // Pull changes
            const pullResult = await execPromise(`git pull origin ${currentBranch}`, { cwd: path });

            success = true;
            message = pullResult.stdout.includes('Already up to date')
              ? 'Already up to date'
              : 'Updated successfully';
            output = pullResult.stdout.trim();
          } catch (err) {
            message = 'No git repository';
          }
        } catch (err) {
          message = 'Repository not found';
        }

        return { name, success, message, output };
      })
    );

    const summary = {
      total: results.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      updated: results.filter(r => r.success && r.message === 'Updated successfully').length,
      upToDate: results.filter(r => r.success && r.message === 'Already up to date').length,
    };

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      summary,
      results,
    });
  } catch (error) {
    console.error('Sync all error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Agent Action: Deploy All (trigger CI/CD)
app.post('/api/agents/deploy-all', async (req, res) => {
  try {
    console.log('🚀 Deploying all repositories...');

    if (!octokit) {
      return res.status(503).json({
        success: false,
        error: 'GitHub API not configured. Set SFS_PAT in environment.'
      });
    }

    const results = await Promise.all(
      REPOS.map(async (name) => {
        let success = false;
        let message = '';
        let workflowId = null;

        try {
          // Get default branch
          const { data: repo } = await octokit.repos.get({
            owner: GITHUB_ORG,
            repo: name,
          });

          // List workflows
          const { data: workflows } = await octokit.actions.listRepoWorkflows({
            owner: GITHUB_ORG,
            repo: name,
          });

          if (workflows.total_count === 0) {
            message = 'No workflows found';
            return { name, success: false, message };
          }

          // Trigger the first workflow (usually CI/CD)
          const workflow = workflows.workflows[0];

          await octokit.actions.createWorkflowDispatch({
            owner: GITHUB_ORG,
            repo: name,
            workflow_id: workflow.id,
            ref: repo.default_branch,
          });

          success = true;
          message = `Triggered: ${workflow.name}`;
          workflowId = workflow.id;
        } catch (err) {
          message = err.message;
        }

        return { name, success, message, workflowId };
      })
    );

    const summary = {
      total: results.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      noWorkflows: results.filter(r => r.message === 'No workflows found').length,
    };

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      summary,
      results,
    });
  } catch (error) {
    console.error('Deploy all error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Agent Action: Get Activity Logs
app.get('/api/agents/logs', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const logs = await Promise.all(
      REPOS.slice(0, 5).map(async (name) => { // Sample first 5 repos
        const path = join(SFS_BASE_PATH, name);
        let commits = [];

        try {
          const { stdout } = await execPromise(
            `git log -${limit} --pretty=format:"%h|%an|%ar|%s"`,
            { cwd: path }
          );

          commits = stdout.split('\n').filter(Boolean).map(line => {
            const [hash, author, date, message] = line.split('|');
            return { repo: name, hash, author, date, message };
          });
        } catch (err) {
          // Repo might not have git
        }

        return commits;
      })
    );

    const allLogs = logs.flat().sort((a, b) => {
      // Sort by date (most recent first)
      return 0; // Simple sort, could be improved
    });

    res.json({
      success: true,
      total: allLogs.length,
      logs: allLogs.slice(0, limit),
    });
  } catch (error) {
    console.error('Logs error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Agent Action: Fix Common Issues
app.post('/api/agents/fix-issues', async (req, res) => {
  try {
    const { action, repos } = req.body; // action: 'npm-install', 'git-reset', etc.

    const targetRepos = repos || REPOS;
    const results = [];

    for (const name of targetRepos) {
      const path = join(SFS_BASE_PATH, name);
      let success = false;
      let message = '';

      try {
        await fs.access(path);

        switch (action) {
          case 'npm-install':
            try {
              const packageJsonPath = join(path, 'package.json');
              await fs.access(packageJsonPath);
              const { stdout } = await execPromise('npm install', { cwd: path });
              success = true;
              message = 'Dependencies installed';
            } catch (err) {
              message = 'No package.json or install failed';
            }
            break;

          case 'git-reset':
            try {
              await execPromise('git reset --hard HEAD', { cwd: path });
              success = true;
              message = 'Reset to HEAD';
            } catch (err) {
              message = 'Git reset failed';
            }
            break;

          case 'clear-cache':
            try {
              await execPromise('rm -rf node_modules package-lock.json && npm install', { cwd: path });
              success = true;
              message = 'Cache cleared and reinstalled';
            } catch (err) {
              message = 'Clear cache failed';
            }
            break;

          default:
            message = 'Unknown action';
        }
      } catch (err) {
        message = 'Repository not found';
      }

      results.push({ name, success, message });
    }

    res.json({
      success: true,
      action,
      results,
    });
  } catch (error) {
    console.error('Fix issues error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Fallback to serve React app
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🎯 SFS Control Tower API running on http://0.0.0.0:${PORT}`);
  console.log(`📊 Monitoring ${REPOS.length} repositories in ${SFS_BASE_PATH}`);
});
