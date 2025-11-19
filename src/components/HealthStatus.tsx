export function HealthStatus() {
  return (
    <div className="bg-sfs-brown rounded-lg p-6 border border-sfs-gold/30">
      <h2 className="text-xl font-bold text-sfs-gold mb-4">System Health</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-green-400">24/26</div>
          <div className="text-sfs-beige/70 text-sm">Repos Healthy</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-sfs-gold">8</div>
          <div className="text-sfs-beige/70 text-sm">Prod Ready</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-yellow-400">3</div>
          <div className="text-sfs-beige/70 text-sm">In Dev</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-400">5</div>
          <div className="text-sfs-beige/70 text-sm">Agents Active</div>
        </div>
      </div>
    </div>
  )
}
