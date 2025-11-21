import { useState, useEffect } from 'react'
import type { StripeBillingOverview } from '../types/repo'

export function StripeDashboard() {
  const [billing, setBilling] = useState<StripeBillingOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBillingData()

    // Refresh billing data every 60 seconds
    const interval = setInterval(() => {
      fetchBillingData()
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const fetchBillingData = () => {
    fetch('/api/billing/overview')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch billing data')
        return res.json()
      })
      .then(data => {
        setBilling(data)
        setLoading(false)
        setError(null)
      })
      .catch(err => {
        console.error('Failed to fetch billing:', err)
        setError(err.message)
        setLoading(false)
      })
  }

  if (loading) {
    return (
      <div className="bg-sfs-brown rounded-lg p-6 border border-sfs-gold/30 animate-pulse">
        <h2 className="text-xl font-bold text-sfs-gold mb-4">Stripe Billing Overview</h2>
        <div className="text-sfs-beige/50 text-center">Loading billing data...</div>
      </div>
    )
  }

  if (error || !billing) {
    return (
      <div className="bg-sfs-brown rounded-lg p-6 border border-yellow-500/30">
        <h2 className="text-xl font-bold text-sfs-gold mb-4">Stripe Billing Overview</h2>
        <div className="text-yellow-300 text-center text-sm">
          {error || 'No billing data available'}
          <div className="mt-2 text-xs text-sfs-beige/50">
            Ensure Stripe API keys are configured in projects
          </div>
        </div>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100)
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="bg-sfs-brown rounded-lg p-6 border border-sfs-gold/30">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-sfs-gold">Stripe Billing Overview</h2>
        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded border border-green-500/30">
          Live
        </span>
      </div>

      {/* Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-sfs-black/30 p-4 rounded">
          <div className="text-sfs-beige/70 text-sm mb-1">Total Revenue</div>
          <div className="text-2xl font-bold text-green-400">
            {formatCurrency(billing.totalRevenue)}
          </div>
        </div>

        <div className="bg-sfs-black/30 p-4 rounded">
          <div className="text-sfs-beige/70 text-sm mb-1">Monthly Recurring</div>
          <div className="text-2xl font-bold text-sfs-gold">
            {formatCurrency(billing.monthlyRecurringRevenue)}
          </div>
        </div>

        <div className="bg-sfs-black/30 p-4 rounded">
          <div className="text-sfs-beige/70 text-sm mb-1">Active Subscriptions</div>
          <div className="text-2xl font-bold text-blue-400">
            {billing.activeSubscriptions}
          </div>
        </div>
      </div>

      {/* Revenue by Project */}
      {Object.keys(billing.revenueByProject).length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-sfs-gold mb-3">Revenue by Project</h3>
          <div className="space-y-2">
            {Object.entries(billing.revenueByProject)
              .sort(([, a], [, b]) => b - a)
              .map(([project, revenue]) => (
                <div
                  key={project}
                  className="flex justify-between items-center bg-sfs-black/30 p-3 rounded text-sm"
                >
                  <span className="text-sfs-beige">{project}</span>
                  <span className="text-green-400 font-semibold">
                    {formatCurrency(revenue)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      {billing.recentTransactions.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-sfs-gold mb-3">Recent Transactions</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {billing.recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex justify-between items-start bg-sfs-black/30 p-3 rounded text-sm"
              >
                <div className="flex-1">
                  <div className="text-sfs-beige font-medium">
                    {transaction.description || transaction.customer}
                  </div>
                  <div className="text-sfs-beige/50 text-xs mt-1">
                    {formatDate(transaction.created)}
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`font-semibold ${
                      transaction.status === 'succeeded'
                        ? 'text-green-400'
                        : transaction.status === 'pending'
                        ? 'text-yellow-400'
                        : 'text-red-400'
                    }`}
                  >
                    {formatCurrency(transaction.amount)}
                  </div>
                  <div className="text-xs text-sfs-beige/50 mt-1 capitalize">
                    {transaction.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
