import { RepoCard } from './RepoCard'

export function RepoGrid({ repos, loading }: any) {
  if (loading) {
    return (
      <div className="bg-sfs-brown/50 rounded-lg p-6">
        <div className="text-sfs-gold text-center py-12">
          <div className="text-4xl mb-4">⏳</div>
          <div>Loading repositories...</div>
        </div>
      </div>
    )
  }

  const healthyCount = repos.filter((r: any) => r.status === 'healthy').length
  const missingCount = repos.filter((r: any) => r.status === 'missing').length
  const noGitCount = repos.filter((r: any) => r.status === 'no-git').length

  return (
    <div className="bg-sfs-brown/50 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-sfs-gold">
          All Repositories ({repos.length})
        </h2>
        <div className="flex gap-4 text-sm">
          {healthyCount > 0 && (
            <span className="text-green-400">✓ {healthyCount} healthy</span>
          )}
          {missingCount > 0 && (
            <span className="text-red-400">✗ {missingCount} missing</span>
          )}
          {noGitCount > 0 && (
            <span className="text-yellow-400">⚠ {noGitCount} no-git</span>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {repos.map((repo: any) => (
          <RepoCard key={repo.name} repo={repo} />
        ))}
      </div>
    </div>
  )
}
