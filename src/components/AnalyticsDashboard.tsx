import { useState, useEffect } from 'react'
import type { UnifiedAnalytics } from '../types/repo'

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<UnifiedAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalytics()

    // Refresh analytics every 60 seconds
    const interval = setInterval(() => {
      fetchAnalytics()
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const fetchAnalytics = () => {
    fetch('/api/analytics/overview')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch analytics')
        return res.json()
      })
      .then(data => {
        setAnalytics(data)
        setLoading(false)
        setError(null)
      })
      .catch(err => {
        console.error('Failed to fetch analytics:', err)
        setError(err.message)
        setLoading(false)
      })
  }

  if (loading) {
    return (
      <div className="bg-sfs-brown rounded-lg p-6 border border-sfs-gold/30 animate-pulse">
        <h2 className="text-xl font-bold text-sfs-gold mb-4">Unified Analytics</h2>
        <div className="text-sfs-beige/50 text-center">Loading analytics...</div>
      </div>
    )
  }

  if (error || !analytics) {
    return (
      <div className="bg-sfs-brown rounded-lg p-6 border border-yellow-500/30">
        <h2 className="text-xl font-bold text-sfs-gold mb-4">Unified Analytics</h2>
        <div className="text-yellow-300 text-center text-sm">
          {error || 'No analytics data available'}
        </div>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-green-400'
    if (score >= 70) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="bg-sfs-brown rounded-lg p-6 border border-sfs-gold/30">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-sfs-gold">Unified Analytics</h2>
        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded border border-blue-500/30">
          All Projects
        </span>
      </div>

      {/* Top-Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-sfs-black/30 p-4 rounded">
          <div className="text-sfs-beige/70 text-sm mb-1">Total Customers</div>
          <div className="text-3xl font-bold text-sfs-gold">
            {analytics.totalCustomers.toLocaleString()}
          </div>
        </div>

        <div className="bg-sfs-black/30 p-4 rounded">
          <div className="text-sfs-beige/70 text-sm mb-1">Total Revenue</div>
          <div className="text-3xl font-bold text-green-400">
            {formatCurrency(analytics.totalRevenue)}
          </div>
        </div>

        <div className="bg-sfs-black/30 p-4 rounded">
          <div className="text-sfs-beige/70 text-sm mb-1">Active Deployments</div>
          <div className="text-3xl font-bold text-blue-400">
            {analytics.activeDeployments}
          </div>
        </div>
      </div>

      {/* Project Breakdown */}
      <div>
        <h3 className="text-sm font-semibold text-sfs-gold mb-3">Project Breakdown</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {analytics.projectBreakdown
            .sort((a, b) => b.revenue - a.revenue)
            .map((project) => (
              <div
                key={project.name}
                className="bg-sfs-black/30 p-4 rounded hover:bg-sfs-black/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-sfs-beige font-semibold">{project.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-sfs-beige/60">
                        Health Score:
                      </span>
                      <span className={`text-xs font-bold ${getHealthColor(project.healthScore)}`}>
                        {project.healthScore}%
                      </span>
                    </div>
                  </div>
                  {project.activeDeployments > 0 && (
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded border border-green-500/30">
                      Live
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <div className="text-sfs-beige/50 text-xs mb-1">Customers</div>
                    <div className="text-sfs-gold font-semibold">
                      {project.customers.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sfs-beige/50 text-xs mb-1">Revenue</div>
                    <div className="text-green-400 font-semibold">
                      {formatCurrency(project.revenue)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sfs-beige/50 text-xs mb-1">Deployments</div>
                    <div className="text-blue-400 font-semibold">
                      {project.activeDeployments}
                    </div>
                  </div>
                </div>

                {/* Health Score Bar */}
                <div className="mt-3">
                  <div className="h-2 bg-sfs-black rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        project.healthScore >= 90
                          ? 'bg-green-400'
                          : project.healthScore >= 70
                          ? 'bg-yellow-400'
                          : 'bg-red-400'
                      }`}
                      style={{ width: `${project.healthScore}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
