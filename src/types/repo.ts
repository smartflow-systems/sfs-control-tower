export type RepoStatus = 'healthy' | 'no-git' | 'missing';

export interface Repository {
  name: string;
  status: RepoStatus;
  path: string;
  hasGit: boolean;
}

export interface SystemStats {
  total: number;
  healthy: number;
  missing: number;
  noGit: number;
  prodReady: number;
  inDev: number;
  agentsActive: number;
}

export interface RepoCategory {
  name: string;
  repos: string[];
}

export const REPO_CATEGORIES: RepoCategory[] = [
  {
    name: 'Core Platform',
    repos: ['SmartFlowSite', 'sfs-core-services', 'sfs-white-label-dashboard']
  },
  {
    name: 'Data & Analytics',
    repos: ['SFSDataQueryEngine', 'DataScrapeInsights', 'sfs-analytics-engine']
  },
  {
    name: 'Social & Marketing',
    repos: [
      'SocialScaleBooster',
      'SocialScaleBoosterAIbot',
      'sfs-marketing-and-growth',
      'sfs-marketing-toolkit'
    ]
  },
  {
    name: 'Business Management',
    repos: [
      'SFSAPDemoCRM',
      'Barber-booker-tempate-v1',
      'sfs-project-manager',
      'sfs-invoice-billing',
      'sfs-business-suite'
    ]
  },
  {
    name: 'Content & Media',
    repos: ['sfs-video-platform', 'sfs-knowledge-base', 'sfs-comms-hub']
  },
  {
    name: 'Developer Tools',
    repos: ['codegpt', 'sfs-embed-sdk', 'sfs-url-shortener', 'SFSPersonalVPN']
  },
  {
    name: 'AI & Automation',
    repos: ['AICompanionBot']
  },
  {
    name: 'Branding',
    repos: ['sfs-brand-assets']
  },
  {
    name: 'Demo/Testing',
    repos: ['demo-repository', 'WebsiteBuilder']
  }
];
