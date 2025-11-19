import { useState, useEffect } from 'react'
import { RepoGrid } from '../components/RepoGrid'
import { AgentPanel } from '../components/AgentPanel'
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
        <div>
          <AgentPanel />
        </div>
      </div>
    </div>
  )
}
