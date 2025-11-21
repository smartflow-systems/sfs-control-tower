import { useState, useEffect } from 'react'
import type { AlertsOverview, Alert } from '../types/repo'

export function AlertPanel() {
  const [alerts, setAlerts] = useState<AlertsOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTab, setSelectedTab] = useState<'critical' | 'warnings' | 'resolved'>('critical')

  useEffect(() => {
    fetchAlerts()

    // Refresh alerts every 30 seconds
    const interval = setInterval(() => {
      fetchAlerts()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const fetchAlerts = () => {
    fetch('/api/alerts/overview')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch alerts')
        return res.json()
      })
      .then(data => {
        setAlerts(data)
        setLoading(false)
        setError(null)
      })
      .catch(err => {
        console.error('Failed to fetch alerts:', err)
        setError(err.message)
        setLoading(false)
      })
  }

  const resolveAlert = async (alertId: string) => {
    try {
      const res = await fetch(`/api/alerts/${alertId}/resolve`, {
        method: 'POST',
      })
      if (!res.ok) throw new Error('Failed to resolve alert')

      // Refresh alerts after resolving
      fetchAlerts()
    } catch (err) {
      console.error('Failed to resolve alert:', err)
    }
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return '🔴'
      case 'warning':
        return '⚠️'
      default:
        return 'ℹ️'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-red-500/50 bg-red-500/10'
      case 'warning':
        return 'border-yellow-500/50 bg-yellow-500/10'
      default:
        return 'border-blue-500/50 bg-blue-500/10'
    }
  }

  const renderAlertList = (alertList: Alert[]) => {
    if (alertList.length === 0) {
      return (
        <div className="text-center py-8 text-sfs-beige/50 text-sm">
          No alerts in this category
        </div>
      )
    }

    return (
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {alertList.map((alert) => (
          <div
            key={alert.id}
            className={`p-3 rounded border ${getSeverityColor(alert.severity)}`}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-2 flex-1">
                <span className="text-lg leading-none mt-0.5">
                  {getSeverityIcon(alert.severity)}
                </span>
                <div className="flex-1">
                  <div className="text-sfs-beige text-sm font-medium">
                    {alert.message}
                  </div>
                  {alert.repo && (
                    <div className="text-sfs-beige/50 text-xs mt-1">
                      Repository: {alert.repo}
                    </div>
                  )}
                  <div className="text-sfs-beige/50 text-xs mt-1">
                    {formatTime(alert.timestamp)}
                  </div>
                </div>
              </div>
              {!alert.resolved && (
                <button
                  onClick={() => resolveAlert(alert.id)}
                  className="text-xs bg-sfs-gold/20 text-sfs-gold px-2 py-1 rounded hover:bg-sfs-gold/30 transition-colors border border-sfs-gold/30"
                >
                  Resolve
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-sfs-brown rounded-lg p-6 border border-sfs-gold/30 animate-pulse">
        <h2 className="text-xl font-bold text-sfs-gold mb-4">System Alerts</h2>
        <div className="text-sfs-beige/50 text-center">Loading alerts...</div>
      </div>
    )
  }

  if (error || !alerts) {
    return (
      <div className="bg-sfs-brown rounded-lg p-6 border border-yellow-500/30">
        <h2 className="text-xl font-bold text-sfs-gold mb-4">System Alerts</h2>
        <div className="text-yellow-300 text-center text-sm">
          {error || 'No alerts data available'}
        </div>
      </div>
    )
  }

  const criticalCount = alerts.critical.length
  const warningCount = alerts.warnings.length
  const resolvedCount = alerts.recentResolved.length

  return (
    <div className="bg-sfs-brown rounded-lg p-6 border border-sfs-gold/30">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-sfs-gold">System Alerts</h2>
        {criticalCount > 0 && (
          <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded border border-red-500/30 animate-pulse">
            {criticalCount} Critical
          </span>
        )}
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <button
          onClick={() => setSelectedTab('critical')}
          className={`p-3 rounded text-center transition-colors ${
            selectedTab === 'critical'
              ? 'bg-red-500/20 border-2 border-red-500/50'
              : 'bg-sfs-black/30 border border-sfs-gold/20 hover:bg-sfs-black/50'
          }`}
        >
          <div className="text-2xl font-bold text-red-400">{criticalCount}</div>
          <div className="text-xs text-sfs-beige/70 mt-1">Critical</div>
        </button>

        <button
          onClick={() => setSelectedTab('warnings')}
          className={`p-3 rounded text-center transition-colors ${
            selectedTab === 'warnings'
              ? 'bg-yellow-500/20 border-2 border-yellow-500/50'
              : 'bg-sfs-black/30 border border-sfs-gold/20 hover:bg-sfs-black/50'
          }`}
        >
          <div className="text-2xl font-bold text-yellow-400">{warningCount}</div>
          <div className="text-xs text-sfs-beige/70 mt-1">Warnings</div>
        </button>

        <button
          onClick={() => setSelectedTab('resolved')}
          className={`p-3 rounded text-center transition-colors ${
            selectedTab === 'resolved'
              ? 'bg-green-500/20 border-2 border-green-500/50'
              : 'bg-sfs-black/30 border border-sfs-gold/20 hover:bg-sfs-black/50'
          }`}
        >
          <div className="text-2xl font-bold text-green-400">{resolvedCount}</div>
          <div className="text-xs text-sfs-beige/70 mt-1">Resolved</div>
        </button>
      </div>

      {/* Alert List */}
      <div className="mt-4">
        {selectedTab === 'critical' && renderAlertList(alerts.critical)}
        {selectedTab === 'warnings' && renderAlertList(alerts.warnings)}
        {selectedTab === 'resolved' && renderAlertList(alerts.recentResolved)}
      </div>
    </div>
  )
}
