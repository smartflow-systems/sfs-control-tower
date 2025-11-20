import { useState, useEffect } from 'react'

export function HealthStatus() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch stats:', err)
        setLoading(false)
      })

    // Refresh stats every 30 seconds
    const interval = setInterval(() => {
      fetch('/api/stats')
        .then(res => res.json())
        .then(data => setStats(data))
        .catch(err => console.error('Failed to refresh stats:', err))
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="bg-sfs-brown rounded-lg p-6 border border-sfs-gold/30 animate-pulse">
        <h2 className="text-xl font-bold text-sfs-gold mb-4">System Health</h2>
        <div className="text-sfs-beige/50 text-center">Loading stats...</div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="bg-sfs-brown rounded-lg p-6 border border-red-500/30">
        <h2 className="text-xl font-bold text-red-400 mb-4">System Health</h2>
        <div className="text-red-300 text-center">Failed to load stats</div>
      </div>
    )
  }

  const healthPercentage = Math.round((stats.healthy / stats.total) * 100)

  return (
    <div className="bg-sfs-brown rounded-lg p-6 border border-sfs-gold/30">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-sfs-gold">System Health</h2>
        {stats.githubConnected && (
          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded border border-green-500/30">
            🔗 GitHub Connected
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center bg-sfs-black/30 p-4 rounded">
          <div className="text-3xl font-bold text-green-400">
            {stats.healthy}/{stats.total}
          </div>
          <div className="text-sfs-beige/70 text-sm mt-1">Repos Healthy</div>
          <div className="text-xs text-green-400 mt-1">{healthPercentage}%</div>
        </div>

        <div className="text-center bg-sfs-black/30 p-4 rounded">
          <div className="text-3xl font-bold text-sfs-gold">{stats.prodReady}</div>
          <div className="text-sfs-beige/70 text-sm mt-1">Prod Ready</div>
        </div>

        <div className="text-center bg-sfs-black/30 p-4 rounded">
          <div className="text-3xl font-bold text-yellow-400">{stats.inDev}</div>
          <div className="text-sfs-beige/70 text-sm mt-1">In Dev</div>
        </div>

        <div className="text-center bg-sfs-black/30 p-4 rounded">
          <div className="text-3xl font-bold text-blue-400">{stats.agentsActive}</div>
          <div className="text-sfs-beige/70 text-sm mt-1">Agents Active</div>
        </div>
      </div>

      {(stats.missing > 0 || stats.noGit > 0) && (
        <div className="mt-4 flex gap-3 text-sm">
          {stats.missing > 0 && (
            <span className="text-red-400">⚠ {stats.missing} missing locally</span>
          )}
          {stats.noGit > 0 && (
            <span className="text-yellow-400">⚠ {stats.noGit} without git</span>
          )}
        </div>
      )}
    </div>
  )
}
