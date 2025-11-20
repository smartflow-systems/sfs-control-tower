# 🚀 SFS Control Tower - Replit Deployment Guide

## Quick Deploy to Replit

### Prerequisites
- Replit account
- GitHub repository with Control Tower code
- `SFS_PAT` (GitHub Personal Access Token)

---

## Step 1: Import to Replit

1. Go to https://replit.com
2. Click **"Create Repl"**
3. Choose **"Import from GitHub"**
4. Select: `smartflow-systems/sfs-control-tower`
5. Click **"Import from GitHub"**

---

## Step 2: Configure Secrets

In Replit, go to the **Secrets** tab (🔒 icon) and add:

```bash
# Required
SFS_PAT=ghp_your_github_personal_access_token_here

# Optional
SFS_BASE_PATH=/home/runner/SFS  # Will be empty on Replit
PORT=3000
NODE_ENV=production
```

**Important:** Without `SFS_PAT`, you'll only see local repo status (which will all be "missing" on Replit), but GitHub data won't load.

---

## Step 3: Install Dependencies

Replit should auto-detect `package.json` and install dependencies. If not:

```bash
npm install
```

---

## Step 4: Build the Frontend

Before running, build the React frontend:

```bash
npm run build
```

This creates the `dist/` folder that the server will serve.

---

## Step 5: Start the Server

Click the **"Run"** button, or execute:

```bash
npm run start
```

The server will:
- Start on port 3000 (or `$PORT`)
- Serve the built React app from `dist/`
- Provide API endpoints at `/api/*`
- Show health check at `/health`

---

## Step 6: Access Your Dashboard

Once running, Replit will provide a URL like:

```
https://sfs-control-tower.your-username.repl.co
```

Open this URL to access your Control Tower dashboard!

---

## Expected Behavior on Replit

### What Works:
- ✅ Full GitHub integration (issues, PRs, commits, workflows)
- ✅ Real-time repo health from GitHub
- ✅ Dashboard UI with all 26 repos
- ✅ Repo detail modals
- ✅ CI/CD workflow status
- ✅ System-wide stats

### What Won't Work:
- ❌ Local repo cloning (no `/home/garet/SFS` on Replit)
- ❌ All repos will show `status: "missing"` locally
- ⚠️ But GitHub data will still load for all repos!

### Why This Is Fine:
The Control Tower primarily monitors GitHub data. Local status is secondary and only useful for your dev machine. On Replit, you're running a **pure monitoring dashboard** without needing local clones.

---

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SFS_PAT` | ✅ Yes | - | GitHub Personal Access Token |
| `PORT` | No | 3000 | Server port |
| `NODE_ENV` | No | development | Environment mode |
| `SFS_BASE_PATH` | No | /home/garet/SFS | Local repo path (unused on Replit) |

---

## Troubleshooting

### "GitHub API not configured" error
- **Fix:** Add `SFS_PAT` to Replit Secrets
- **Verify:** Check token has `repo`, `read:org`, `workflow` permissions
- **Restart:** Click Stop → Run after adding secrets

### Build fails
```bash
# Clear cache and rebuild
rm -rf dist node_modules
npm install
npm run build
```

### Port already in use
- Replit automatically manages ports
- Use `$PORT` environment variable (already configured)

### Can't see repos
- **Expected!** Repos will show as "missing" locally on Replit
- **But:** GitHub data (PRs, issues, commits) still loads
- **Purpose:** Control Tower is primarily a **GitHub monitoring dashboard**

---

## Updating the Deployment

### Method 1: GitHub Push (Recommended)

1. Make changes locally
2. Push to GitHub:
   ```bash
   git add .
   git commit -m "feat: your changes"
   git push origin main
   ```
3. In Replit, pull latest:
   ```bash
   git pull origin main
   npm install
   npm run build
   ```
4. Click **Run** to restart

### Method 2: Direct Edit in Replit

1. Edit files in Replit editor
2. Rebuild:
   ```bash
   npm run build
   ```
3. Click **Run** to restart

---

## Custom Domain (Optional)

Replit allows custom domains on paid plans:

1. Go to Replit → **Domains** tab
2. Add custom domain (e.g., `control.smartflowsystems.com`)
3. Update DNS records as instructed
4. SSL auto-configured by Replit

---

## Performance Considerations

### Rate Limiting
- GitHub API limit: 5000 requests/hour (authenticated)
- Current usage: ~78 requests per full dashboard load
- Dashboard auto-refreshes stats every 30 seconds
- Hourly usage: ~78 + (120 × 26) = ~3,198 requests
- **Status:** Well within limits ✅

### Caching (Future Enhancement)
To reduce API calls, consider:
- Redis caching layer
- 5-minute cache for repo data
- 1-minute cache for stats

---

## Production Checklist

Before going live:

- [ ] `SFS_PAT` added to Secrets
- [ ] `npm run build` completed successfully
- [ ] Dashboard loads at Replit URL
- [ ] GitHub data appears for all 26 repos
- [ ] Health endpoint responds: `https://your-repl.co/health`
- [ ] API endpoints work: `https://your-repl.co/api/stats`
- [ ] No console errors in browser
- [ ] Repo detail modals open correctly

---

## Monitoring & Alerts

### Health Check
Monitor uptime with:
```bash
curl https://your-repl.co/health
# Expected: {"ok":true,"timestamp":"..."}
```

### UptimeRobot Setup
1. Add monitor: https://uptimerobot.com
2. Monitor type: HTTP(s)
3. URL: `https://your-repl.co/health`
4. Interval: 5 minutes
5. Alert contacts: Your email

### GitHub Webhook (Future)
For real-time updates when repos change:
- Add webhook in GitHub org settings
- Point to: `https://your-repl.co/api/webhook`
- Events: Push, Pull Request, Workflow Run

---

## Cost Considerations

### Free Tier
- ✅ Hosting: Free on Replit
- ✅ GitHub API: Free (5000 req/hour)
- ✅ Deployment: Free

### Paid Tier (Optional)
- Custom domain: $7/month (Replit Hacker)
- Always-on: Included in Hacker plan
- More compute: Available if needed

**Cost for basic deployment: $0/month** 🎉

---

## Security Best Practices

1. **Never commit `.env` to git** (already in `.gitignore`)
2. **Use Replit Secrets** for sensitive data
3. **Rotate `SFS_PAT` regularly** (every 90 days)
4. **Monitor access logs** for unusual activity
5. **Enable 2FA** on GitHub and Replit accounts

---

## Support & Resources

- **Replit Docs:** https://docs.replit.com
- **GitHub API Docs:** https://docs.github.com/en/rest
- **Control Tower Repo:** https://github.com/smartflow-systems/sfs-control-tower
- **Issues:** Report at GitHub Issues

---

**Deployed with ❤️ by SmartFlow Systems**
**Last Updated:** November 19, 2025
