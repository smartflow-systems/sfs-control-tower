export function RepoGrid({ repos, loading }: any) {
  if (loading) return <div className="text-sfs-gold">Loading repos...</div>

  return (
    <div className="bg-sfs-brown/50 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-sfs-gold mb-4">
        All Repositories (26)
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {repos.map((repo: any) => (
          <div key={repo.name} className="bg-sfs-black/50 p-4 rounded border border-sfs-gold/20">
            <h3 className="text-sfs-gold font-semibold">{repo.name}</h3>
            <p className="text-sfs-beige/70 text-sm">{repo.status}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
