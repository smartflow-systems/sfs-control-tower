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

// Stripe billing types
export interface StripeTransaction {
  id: string;
  amount: number;
  currency: string;
  customer: string;
  status: string;
  created: number;
  description?: string;
}

export interface StripeSubscription {
  id: string;
  customer: string;
  status: string;
  plan: string;
  amount: number;
  currentPeriodEnd: number;
}

export interface StripeBillingOverview {
  totalRevenue: number;
  monthlyRecurringRevenue: number;
  activeSubscriptions: number;
  recentTransactions: StripeTransaction[];
  revenueByProject: Record<string, number>;
}

// Analytics types
export interface ProjectAnalytics {
  name: string;
  customers: number;
  revenue: number;
  activeDeployments: number;
  healthScore: number;
}

export interface UnifiedAnalytics {
  totalCustomers: number;
  totalRevenue: number;
  activeDeployments: number;
  projectBreakdown: ProjectAnalytics[];
}

// Alert types
export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface Alert {
  id: string;
  severity: AlertSeverity;
  message: string;
  repo?: string;
  timestamp: number;
  resolved: boolean;
}

export interface AlertsOverview {
  critical: Alert[];
  warnings: Alert[];
  recentResolved: Alert[];
}

// WebSocket event types
export interface RepoUpdateEvent {
  type: 'repo-status' | 'ci-cd-status' | 'alert';
  repo: string;
  data: any;
  timestamp: number;
}
