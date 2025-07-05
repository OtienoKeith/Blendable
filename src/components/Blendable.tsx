import React, { useState, useEffect } from 'react'
import emailjs from '@emailjs/browser'

// Types for pool data
interface Pool {
  id: string
  name: string
  apy: number
  tvl: number
  token0: string
  token1: string
}

// Types for comparison result
interface ComparisonResult {
  currentPool: Pool
  bestPool: Pool
  yieldDifference: number
}

const Blendable: React.FC = () => {
  const [pools, setPools] = useState<Pool[]>([])
  const [selectedPool, setSelectedPool] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null)
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [error, setError] = useState('')
  const [lastSentEmail, setLastSentEmail] = useState('')

  // Fetch pool data from Blend API
  useEffect(() => {
    setLoading(true)
    // Always use mock data for demo
    const mockPools: Pool[] = [
      { id: '1', name: 'ETH-USDC', apy: 3.2, tvl: 1500000, token0: 'ETH', token1: 'USDC' },
      { id: '2', name: 'XLM-USDC', apy: 5.1, tvl: 800000, token0: 'XLM', token1: 'USDC' },
      { id: '3', name: 'BTC-USDC', apy: 2.8, tvl: 2200000, token0: 'BTC', token1: 'USDC' },
      { id: '4', name: 'SOL-USDC', apy: 4.7, tvl: 950000, token0: 'SOL', token1: 'USDC' },
      { id: '5', name: 'MATIC-USDC', apy: 3.9, tvl: 650000, token0: 'MATIC', token1: 'USDC' }
    ]
    setPools(mockPools)
    setSelectedPool(mockPools[0].id)
    setLoading(false)
  }, [])

  // Find best yield and compare with selected pool
  const checkForBetterYields = () => {
    if (!selectedPool || pools.length === 0) return

    const currentPool = pools.find(pool => pool.id === selectedPool)
    if (!currentPool) return

    const bestPool = pools.reduce((best, pool) => 
      pool.apy > best.apy ? pool : best
    )

    const yieldDifference = bestPool.apy - currentPool.apy

    setComparisonResult({
      currentPool,
      bestPool,
      yieldDifference
    })
  }

  // Send email notification using EmailJS
  const sendEmailNotification = async () => {
    if (!email || !comparisonResult) return

    try {
      setLoading(true)
      
      // EmailJS configuration
      const templateParams = {
        email: email,
        current_pool: comparisonResult.currentPool.name,
        current_apy: `${comparisonResult.currentPool.apy}%`,
        best_pool: comparisonResult.bestPool.name,
        best_apy: `${comparisonResult.bestPool.apy}%`,
        yield_difference: `+${comparisonResult.yieldDifference.toFixed(1)}%`,
        message: `You're currently in ${comparisonResult.currentPool.name} Pool (${comparisonResult.currentPool.apy}% APY). The best pool is ${comparisonResult.bestPool.name} Pool (${comparisonResult.bestPool.apy}% APY). You could earn ${comparisonResult.yieldDifference.toFixed(1)}% more by switching.`
      }

      // Real EmailJS integration
      await emailjs.send(
        'service_ks35r2p', // <-- your Gmail service ID
        'template_r76ftal', // <-- your Blend Protocol template ID
        templateParams,
        'UZuJuE3vOwUmK0hfo' // <-- your public key
      )
      
      setEmailSent(true)
      setEmail('')
      setLastSentEmail(email)
      
      // Reset email sent status after 3 seconds
      setTimeout(() => setEmailSent(false), 3000)
      
    } catch (err) {
      console.error('Error sending email:', err)
      setError('Failed to send email notification. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-blend-900 flex flex-col">
      {/* Top Nav */}
      <nav className="w-full flex items-center justify-between px-6 py-4 bg-blend-900 border-b border-blend-800 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="inline-block w-8 h-8 rounded-full bg-gradient-to-br from-blend-500 to-blend-700 flex items-center justify-center text-xl font-bold text-white">B</span>
          <span className="text-xl font-bold tracking-tight text-blend-50">Blendable</span>
        </div>
        <span className="bg-blend-800 text-blend-300 px-3 py-1 rounded-full text-xs font-semibold border border-blend-700">Powered by Blend</span>
      </nav>
      <main className="flex-1 flex flex-col items-center justify-center px-2 py-8">
        <div className="max-w-xl w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-blend-50 mb-2 tracking-tight drop-shadow">Blendable</h1>
            <p className="text-blend-300 text-lg font-medium">Yield Optimizer for Blend Protocol</p>
          </div>

          {/* Main Card */}
          <div className="card mb-8">
            {/* Pool Selection */}
            <div className="mb-6">
              <label htmlFor="pool-select" className="block text-sm font-semibold text-blend-200 mb-2">Select Your Current Pool</label>
              <select
                id="pool-select"
                value={selectedPool}
                onChange={(e) => setSelectedPool(e.target.value)}
                className="input-field"
                disabled={loading}
              >
                {pools.map((pool) => (
                  <option key={pool.id} value={pool.id}>
                    {pool.name} ({pool.apy}% APY)
                  </option>
                ))}
              </select>
            </div>

            {/* Check Button */}
            <button
              onClick={checkForBetterYields}
              disabled={loading || !selectedPool}
              className="btn-primary w-full mb-6"
            >
              {loading ? 'Loading...' : 'Check for Better Yields'}
            </button>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-900/20 border border-red-700 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            {/* Comparison Results */}
            {comparisonResult && (
              <div className="bg-blend-900 rounded-lg p-4 mb-6 border border-blend-700">
                <h3 className="font-semibold text-blend-100 mb-3">Yield Comparison</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-blend-300">
                    You're in <span className="font-semibold text-blend-50">{comparisonResult.currentPool.name} Pool</span> ({comparisonResult.currentPool.apy}% APY).
                  </p>
                  <p className="text-blend-300">
                    Best Pool: <span className="font-semibold text-blend-50">{comparisonResult.bestPool.name} Pool</span> ({comparisonResult.bestPool.apy}% APY).
                  </p>
                  <p className="text-green-400 font-bold">
                    You could earn {comparisonResult.yieldDifference > 0 ? '+' : ''}{comparisonResult.yieldDifference.toFixed(1)}% more by switching.
                  </p>
                </div>
              </div>
            )}

            {/* Email Notification */}
            {comparisonResult && (
              <div className="border-t border-blend-700 pt-6">
                <h3 className="font-semibold text-blend-100 mb-3">Get Notified</h3>
                <p className="text-sm text-blend-400 mb-4">Enter your email to receive notifications about yield opportunities.</p>
                <div className="flex gap-3">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field flex-1"
                    disabled={loading}
                  />
                  <button
                    onClick={sendEmailNotification}
                    disabled={loading || !email}
                    className="btn-secondary whitespace-nowrap"
                  >
                    {loading ? 'Sending...' : emailSent ? 'Sent!' : 'Notify Me'}
                  </button>
                </div>
              </div>
            )}

            {/* Confirmation Message */}
            {emailSent && (
              <div className="mb-4 p-3 bg-green-900/20 border border-green-700 rounded-lg text-green-300 text-sm">
                Email notification sent successfully to {email || lastSentEmail}!
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-blend-500 mt-8">
            <p>
              &copy; {new Date().getFullYear()} Blendable. Not affiliated with Blend Protocol. <a href="https://blend.xlm.sh" target="_blank" rel="noopener noreferrer" className="text-blend-400 hover:text-blend-200 underline ml-1">blend.xlm.sh</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Blendable 