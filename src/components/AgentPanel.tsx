export function AgentPanel() {
  return (
    <div className="bg-sfs-brown/50 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-sfs-gold mb-4">
        🤖 Agent Control
      </h2>
      <div className="space-y-3">
        <button className="w-full bg-sfs-gold hover:bg-sfs-gold-hover text-sfs-black font-semibold py-2 px-4 rounded">
          Run Health Check
        </button>
        <button className="w-full bg-sfs-gold hover:bg-sfs-gold-hover text-sfs-black font-semibold py-2 px-4 rounded">
          Sync Knowledge
        </button>
        <button className="w-full bg-sfs-gold hover:bg-sfs-gold-hover text-sfs-black font-semibold py-2 px-4 rounded">
          Deploy All
        </button>
      </div>
    </div>
  )
}
