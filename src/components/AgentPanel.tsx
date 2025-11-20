import { useState } from 'react';

interface AgentAction {
  name: string;
  endpoint: string;
  icon: string;
  description: string;
  method: 'GET' | 'POST';
  body?: any;
}

interface ActionResult {
  success: boolean;
  message: string;
  summary?: any;
  results?: any[];
}

export function AgentPanel() {
  const [loading, setLoading] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<ActionResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000';

  const actions: AgentAction[] = [
    {
      name: 'Health Check',
      endpoint: '/api/agents/health-check',
      icon: '🔍',
      description: 'Check health of all 26 repositories',
      method: 'POST',
    },
    {
      name: 'Sync All',
      endpoint: '/api/agents/sync-all',
      icon: '🔄',
      description: 'Git pull latest changes for all repos',
      method: 'POST',
    },
    {
      name: 'Deploy All',
      endpoint: '/api/agents/deploy-all',
      icon: '🚀',
      description: 'Trigger CI/CD workflows for all repos',
      method: 'POST',
    },
    {
      name: 'View Logs',
      endpoint: '/api/agents/logs?limit=20',
      icon: '📋',
      description: 'View recent git activity',
      method: 'GET',
    },
  ];

  const handleAction = async (action: AgentAction) => {
    setLoading(action.name);
    setShowResult(false);
    setLastResult(null);

    try {
      const response = await fetch(`${API_URL}${action.endpoint}`, {
        method: action.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: action.body ? JSON.stringify(action.body) : undefined,
      });

      const data = await response.json();

      if (response.ok) {
        setLastResult({
          success: true,
          message: `${action.icon} ${action.name} completed successfully!`,
          summary: data.summary || {},
          results: data.results || data.logs || [],
        });
      } else {
        setLastResult({
          success: false,
          message: `Failed: ${data.error || 'Unknown error'}`,
        });
      }

      setShowResult(true);
    } catch (error) {
      setLastResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Network error'}`,
      });
      setShowResult(true);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-sfs-brown/50 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-sfs-gold mb-4">
          🤖 Agent Control Panel
        </h2>

        <div className="space-y-3">
          {actions.map((action) => (
            <button
              key={action.name}
              onClick={() => handleAction(action)}
              disabled={loading !== null}
              className="w-full bg-sfs-gold hover:bg-sfs-gold-hover text-sfs-black font-semibold py-3 px-4 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between group"
            >
              <span className="flex items-center gap-2">
                <span className="text-xl">{action.icon}</span>
                <span>{action.name}</span>
              </span>
              {loading === action.name && (
                <div className="animate-spin h-5 w-5 border-2 border-sfs-black border-t-transparent rounded-full" />
              )}
              {!loading && (
                <span className="text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="mt-4 text-sm text-sfs-beige/70 space-y-1">
          {actions.map((action) => (
            <div key={action.name} className="flex items-start gap-2">
              <span className="opacity-50">{action.icon}</span>
              <span className="opacity-70">{action.description}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Results Panel */}
      {showResult && lastResult && (
        <div
          className={`rounded-lg p-6 ${
            lastResult.success
              ? 'bg-green-900/30 border border-green-500/50'
              : 'bg-red-900/30 border border-red-500/50'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-sfs-gold">
              {lastResult.success ? '✅ Success' : '❌ Error'}
            </h3>
            <button
              onClick={() => setShowResult(false)}
              className="text-sfs-beige/50 hover:text-sfs-gold transition-colors"
            >
              ✕
            </button>
          </div>

          <p className="text-sfs-beige mb-4">{lastResult.message}</p>

          {lastResult.summary && (
            <div className="bg-sfs-black/30 rounded p-4 mb-4">
              <h4 className="text-sm font-semibold text-sfs-gold mb-2">Summary</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(lastResult.summary).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-sfs-beige/70 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <span className="text-sfs-gold font-semibold">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {lastResult.results && lastResult.results.length > 0 && (
            <div className="bg-sfs-black/30 rounded p-4 max-h-64 overflow-y-auto">
              <h4 className="text-sm font-semibold text-sfs-gold mb-2">
                Details ({lastResult.results.length} items)
              </h4>
              <div className="space-y-2 text-xs font-mono">
                {lastResult.results.slice(0, 10).map((result: any, idx: number) => (
                  <div key={idx} className="p-2 bg-sfs-black/50 rounded">
                    {result.name && (
                      <div className="text-sfs-gold font-semibold">{result.name}</div>
                    )}
                    {result.repo && (
                      <div className="text-sfs-gold font-semibold">{result.repo}</div>
                    )}
                    {result.message && (
                      <div className="text-sfs-beige/70">{result.message}</div>
                    )}
                    {result.hash && (
                      <div className="text-sfs-beige/50">
                        {result.hash} - {result.author} ({result.date})
                      </div>
                    )}
                    {result.success !== undefined && (
                      <div className={result.success ? 'text-green-400' : 'text-red-400'}>
                        {result.success ? '✓' : '✗'} {result.message || result.output}
                      </div>
                    )}
                  </div>
                ))}
                {lastResult.results.length > 10 && (
                  <div className="text-center text-sfs-beige/50">
                    ... and {lastResult.results.length - 10} more
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Status Indicator */}
      <div className="bg-sfs-brown/30 rounded-lg p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-sfs-beige/70">Agent System Status</span>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 font-semibold">
              {loading ? 'Processing...' : 'Ready'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
