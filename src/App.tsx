import { useState } from 'react'
import { Dashboard } from './pages/Dashboard'
import './index.css'

function App() {
  return (
    <div className="min-h-screen bg-sfs-black text-white">
      <header className="bg-sfs-brown border-b border-sfs-gold/20">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-sfs-gold">
            🎯 SFS Control Tower
          </h1>
          <p className="text-sfs-beige/70 mt-1">
            SmartFlow Systems Operations Center
          </p>
        </div>
      </header>
      <main>
        <Dashboard />
      </main>
    </div>
  )
}

export default App
