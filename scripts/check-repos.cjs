#!/usr/bin/env node

/**
 * SFS Control Tower - Repository Health Checker
 * Scans all 26 SFS repositories and reports status
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SFS_BASE_PATH = '/home/garet/SFS';

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

console.log('🎯 SFS Control Tower - Repository Health Check\n');
console.log('═'.repeat(60));

let healthyCount = 0;
let missingCount = 0;

REPOS.forEach((repo, index) => {
  const repoPath = path.join(SFS_BASE_PATH, repo);
  const exists = fs.existsSync(repoPath);
  const isGit = exists && fs.existsSync(path.join(repoPath, '.git'));

  const status = exists
    ? (isGit ? '✅ HEALTHY' : '⚠️  NO GIT')
    : '❌ MISSING';

  if (exists && isGit) healthyCount++;
  if (!exists) missingCount++;

  console.log(`${(index + 1).toString().padStart(2)}. ${repo.padEnd(35)} ${status}`);
});

console.log('═'.repeat(60));
console.log(`\n📊 Summary: ${healthyCount}/${REPOS.length} healthy | ${missingCount} missing`);

process.exit(0);
