import { useState } from 'react'
import { RepoDetailModal } from './RepoDetailModal'

interface RepoCardProps {
  repo: any
}

export function RepoCard({ repo }: RepoCardProps) {
  const [showModal, setShowModal] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'missing':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'no-git':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getWorkflowStatusIcon = (status: string | null) => {
    if (!status) return null
    switch (status) {
      case 'success':
        return '✅'
      case 'failure':
        return '❌'
      case 'in_progress':
        return '⏳'
      default:
        return '⚪'
    }
  }

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        className="bg-sfs-black/50 p-4 rounded border border-sfs-gold/20 hover:border-sfs-gold/50 cursor-pointer transition-all hover:scale-105"
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sfs-gold font-semibold text-lg">{repo.name}</h3>
          <span
            className={`px-2 py-1 rounded text-xs border ${getStatusColor(repo.status)}`}
          >
            {repo.status}
          </span>
        </div>

        {repo.github && (
          <div className="space-y-2 mt-3">
            <div className="flex items-center gap-2 text-sm text-sfs-beige/70">
              <span className="text-sfs-gold">⭐</span>
              <span>{repo.github.stars || 0} stars</span>
              {repo.github.language && (
                <>
                  <span className="text-sfs-gold">•</span>
                  <span>{repo.github.language}</span>
                </>
              )}
            </div>

            {(repo.github.openPRs > 0 || repo.github.openIssues > 0) && (
              <div className="flex gap-3 text-sm">
                {repo.github.openPRs > 0 && (
                  <span className="text-blue-400">
                    🔀 {repo.github.openPRs} PRs
                  </span>
                )}
                {repo.github.openIssues > 0 && (
                  <span className="text-purple-400">
                    📋 {repo.github.openIssues} Issues
                  </span>
                )}
              </div>
            )}

            {repo.github.workflowStatus && (
              <div className="text-sm">
                <span className="text-sfs-beige/70">CI/CD: </span>
                <span>
                  {getWorkflowStatusIcon(repo.github.workflowStatus)}{' '}
                  {repo.github.workflowStatus}
                </span>
              </div>
            )}

            {repo.github.lastCommit && (
              <div className="text-xs text-sfs-beige/50 mt-2 truncate">
                💬 {repo.github.lastCommit.message.split('\n')[0]}
              </div>
            )}
          </div>
        )}

        <div className="mt-3 text-xs text-sfs-gold/50 hover:text-sfs-gold transition-colors">
          Click for details →
        </div>
      </div>

      {showModal && (
        <RepoDetailModal
          repo={repo}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}
