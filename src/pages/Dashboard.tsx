import { useState, useEffect } from 'react'
import { RepoGrid } from '../components/RepoGrid'
import { HealthStatus } from '../components/HealthStatus'

export function Dashboard() {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch repo health data
    fetch('/api/repos/health')
      .then(res => res.json())
      .then(data => {
        setRepos(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch repos:', err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <HealthStatus />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RepoGrid repos={repos} loading={loading} />
        </div>
        <div className="bg-sfs-brown/50 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-sfs-gold mb-4">
            Safe Mode
          </h2>
          <p className="text-sfs-beige/80 text-sm">
            Dashboard automation controls are disabled. This view is observe-only
            and exposes repository status without triggering repo-changing actions.
          </p>
        </div>
      </div>
    </div>
  )
}
