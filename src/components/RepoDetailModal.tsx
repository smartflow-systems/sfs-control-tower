interface RepoDetailModalProps {
  repo: any
  onClose: () => void
}

export function RepoDetailModal({ repo, onClose }: RepoDetailModalProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-sfs-brown border-2 border-sfs-gold rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-sfs-black/50 p-6 border-b border-sfs-gold/30">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-sfs-gold">{repo.name}</h2>
              {repo.github?.description && (
                <p className="text-sfs-beige/70 mt-2">{repo.github.description}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-sfs-gold hover:text-sfs-gold-hover text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Local Status */}
          <div>
            <h3 className="text-lg font-semibold text-sfs-gold mb-2">
              Local Status
            </h3>
            <div className="bg-sfs-black/30 p-4 rounded space-y-2">
              <div className="flex justify-between">
                <span className="text-sfs-beige/70">Status:</span>
                <span className="text-sfs-gold">{repo.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sfs-beige/70">Has Git:</span>
                <span className="text-sfs-gold">{repo.hasGit ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sfs-beige/70">Path:</span>
                <span className="text-sfs-gold text-sm font-mono">{repo.path}</span>
              </div>
            </div>
          </div>

          {/* GitHub Info */}
          {repo.github && (
            <>
              <div>
                <h3 className="text-lg font-semibold text-sfs-gold mb-2">
                  GitHub Info
                </h3>
                <div className="bg-sfs-black/30 p-4 rounded space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sfs-beige/70">Stars:</span>
                    <span className="text-sfs-gold">⭐ {repo.github.stars}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sfs-beige/70">Language:</span>
                    <span className="text-sfs-gold">{repo.github.language || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sfs-beige/70">Default Branch:</span>
                    <span className="text-sfs-gold">{repo.github.defaultBranch}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sfs-beige/70">Visibility:</span>
                    <span className="text-sfs-gold">
                      {repo.github.isPrivate ? '🔒 Private' : '🌐 Public'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sfs-beige/70">Last Updated:</span>
                    <span className="text-sfs-gold text-sm">
                      {formatDate(repo.github.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Latest Commit */}
              {repo.github.lastCommit && (
                <div>
                  <h3 className="text-lg font-semibold text-sfs-gold mb-2">
                    Latest Commit
                  </h3>
                  <div className="bg-sfs-black/30 p-4 rounded space-y-2">
                    <div>
                      <span className="text-sfs-beige/70">Message:</span>
                      <p className="text-sfs-gold mt-1 whitespace-pre-wrap">
                        {repo.github.lastCommit.message}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sfs-beige/70">Author:</span>
                      <span className="text-sfs-gold">{repo.github.lastCommit.author}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sfs-beige/70">Date:</span>
                      <span className="text-sfs-gold text-sm">
                        {formatDate(repo.github.lastCommit.date)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Issues & PRs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-sfs-gold mb-2">
                    Open Issues
                  </h3>
                  <div className="bg-sfs-black/30 p-4 rounded text-center">
                    <div className="text-4xl text-purple-400">{repo.github.openIssues}</div>
                    <div className="text-sm text-sfs-beige/70 mt-1">issues</div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-sfs-gold mb-2">
                    Open PRs
                  </h3>
                  <div className="bg-sfs-black/30 p-4 rounded text-center">
                    <div className="text-4xl text-blue-400">{repo.github.openPRs}</div>
                    <div className="text-sm text-sfs-beige/70 mt-1">pull requests</div>
                  </div>
                </div>
              </div>

              {/* Workflow Status */}
              {repo.github.workflowStatus && (
                <div>
                  <h3 className="text-lg font-semibold text-sfs-gold mb-2">
                    CI/CD Status
                  </h3>
                  <div className="bg-sfs-black/30 p-4 rounded">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">
                        {repo.github.workflowStatus === 'success' ? '✅' :
                         repo.github.workflowStatus === 'failure' ? '❌' : '⏳'}
                      </span>
                      <div>
                        <div className="text-sfs-gold font-semibold">
                          {repo.github.workflowStatus.toUpperCase()}
                        </div>
                        <div className="text-sm text-sfs-beige/70">
                          Latest workflow run
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <a
              href={`https://github.com/smartflow-systems/${repo.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-sfs-gold text-sfs-black py-2 px-4 rounded font-semibold hover:bg-sfs-gold-hover transition-colors text-center"
            >
              View on GitHub →
            </a>
            <button
              onClick={onClose}
              className="px-6 py-2 border border-sfs-gold text-sfs-gold rounded hover:bg-sfs-gold/10 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
