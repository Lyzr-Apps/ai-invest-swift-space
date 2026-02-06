'use client'

/**
 * StockAI Watchlist
 * Track and manage saved stocks
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  TrendingUp,
  ArrowLeft,
  RefreshCw,
  Trash2,
  Eye,
  TrendingDown,
  Bookmark
} from 'lucide-react'
import { getWatchlist, removeFromWatchlist, formatDate } from '@/lib/watchlistHelpers'
import type { WatchlistItem } from '@/lib/types'

// ============================================================================
// Watchlist Item Card Component
// ============================================================================

interface WatchlistCardProps {
  item: WatchlistItem
  onRemove: (ticker: string) => void
}

function WatchlistCard({ item, onRemove }: WatchlistCardProps) {
  const getVerdictColor = (verdict?: string) => {
    if (!verdict) return 'bg-[#64748B]/10 text-[#64748B] border-[#64748B]/30'
    const v = verdict.toLowerCase()
    if (v.includes('bullish') || v.includes('invest')) return 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30'
    if (v.includes('bearish') || v.includes('avoid')) return 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30'
    return 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30'
  }

  return (
    <Card className="bg-[#0D1117]/60 border-[#64748B]/20 hover:border-[#3B82F6]/40 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-2xl font-bold text-white">{item.ticker}</h3>
              {item.lastVerdict && (
                <Badge className={getVerdictColor(item.lastVerdict)}>
                  {item.lastVerdict}
                </Badge>
              )}
            </div>
            <p className="text-sm text-[#64748B]">{item.companyName}</p>
          </div>

          <button
            onClick={() => onRemove(item.ticker)}
            className="p-2 rounded-lg hover:bg-[#EF4444]/10 text-[#64748B] hover:text-[#EF4444] transition-colors"
            title="Remove from watchlist"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>

        {item.lastPrice && (
          <div className="mb-4">
            <span className="text-3xl font-semibold text-white">
              ${item.lastPrice.toFixed(2)}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-[#64748B]/10">
          <div className="text-xs text-[#64748B]">
            Added {formatDate(item.addedAt)}
            {item.lastUpdated && (
              <span className="ml-2">• Updated {formatDate(item.lastUpdated)}</span>
            )}
          </div>

          <Link href={`/stock/${item.ticker}`}>
            <Button
              size="sm"
              variant="outline"
              className="border-[#3B82F6]/30 text-[#3B82F6] hover:bg-[#3B82F6]/10"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Analysis
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// Empty State Component
// ============================================================================

function EmptyState() {
  return (
    <Card className="bg-[#0D1117]/60 border-[#64748B]/20">
      <CardContent className="p-16 text-center">
        <div className="flex flex-col items-center gap-6">
          <div className="p-6 rounded-full bg-[#3B82F6]/10">
            <Bookmark className="h-12 w-12 text-[#3B82F6]" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">Your Watchlist is Empty</h3>
            <p className="text-[#64748B] max-w-md">
              Start adding stocks to track them here. Analyze any stock and click "Add to Watchlist" to save it.
            </p>
          </div>

          <div className="flex gap-4">
            <Link href="/stock/AAPL">
              <Button className="bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white">
                Try with Apple
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="border-[#64748B]/30 text-white hover:bg-[#64748B]/10">
                Browse Stocks
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// Main Watchlist Component
// ============================================================================

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadWatchlist()
  }, [])

  const loadWatchlist = () => {
    const items = getWatchlist()
    setWatchlist(items)
  }

  const handleRemove = (ticker: string) => {
    removeFromWatchlist(ticker)
    loadWatchlist()
  }

  const handleRefresh = () => {
    setRefreshing(true)
    loadWatchlist()
    setTimeout(() => setRefreshing(false), 500)
  }

  const sortedWatchlist = [...watchlist].sort((a, b) => {
    return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
  })

  return (
    <div className="min-h-screen bg-[#0D1117]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0D1117]/90 backdrop-blur-lg border-b border-[#64748B]/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <TrendingUp className="h-8 w-8 text-[#3B82F6] group-hover:scale-110 transition-transform" />
              <h1 className="text-2xl font-bold text-white">StockAI</h1>
            </Link>

            <nav className="flex items-center gap-6">
              <Link
                href="/learn"
                className="text-[#64748B] hover:text-[#3B82F6] transition-colors font-medium"
              >
                Learning Hub
              </Link>
              <Link
                href="/watchlist"
                className="text-[#3B82F6] font-medium"
              >
                Watchlist
              </Link>
              <Link href="/">
                <Button variant="outline" className="border-[#64748B]/30 text-white hover:bg-[#64748B]/10">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Bookmark className="h-10 w-10 text-[#3B82F6]" />
                <h2 className="text-4xl font-bold text-white">My Watchlist</h2>
              </div>
              <p className="text-lg text-[#64748B]">
                Track your saved stocks and monitor their performance
              </p>
            </div>

            {watchlist.length > 0 && (
              <Button
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            )}
          </div>

          {/* Stats */}
          {watchlist.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="bg-[#0D1117]/60 border-[#64748B]/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#64748B] mb-1">Total Stocks</p>
                      <p className="text-3xl font-bold text-white">{watchlist.length}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-[#3B82F6]" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#0D1117]/60 border-[#64748B]/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#64748B] mb-1">Bullish Signals</p>
                      <p className="text-3xl font-bold text-[#10B981]">
                        {watchlist.filter(w => w.lastVerdict?.toLowerCase().includes('bullish') || w.lastVerdict?.toLowerCase().includes('invest')).length}
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-[#10B981]" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#0D1117]/60 border-[#64748B]/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#64748B] mb-1">Bearish Signals</p>
                      <p className="text-3xl font-bold text-[#EF4444]">
                        {watchlist.filter(w => w.lastVerdict?.toLowerCase().includes('bearish') || w.lastVerdict?.toLowerCase().includes('avoid')).length}
                      </p>
                    </div>
                    <TrendingDown className="h-8 w-8 text-[#EF4444]" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Watchlist Items */}
          {watchlist.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedWatchlist.map((item) => (
                <WatchlistCard
                  key={item.ticker}
                  item={item}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      {watchlist.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <Card className="bg-gradient-to-r from-[#3B82F6]/20 to-[#0D1117]/60 border-[#3B82F6]/40 max-w-3xl mx-auto">
            <CardContent className="p-12 text-center">
              <h3 className="text-3xl font-bold text-white mb-4">
                Add More Stocks to Your Watchlist
              </h3>
              <p className="text-lg text-[#64748B] mb-8">
                Explore more companies and build your investment portfolio
              </p>
              <Link href="/">
                <Button
                  size="lg"
                  className="px-8 py-6 text-lg bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white"
                >
                  Browse Stocks
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-[#64748B]/20 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[#64748B] text-sm">
            Watchlist - Track and monitor your saved stocks
          </p>
        </div>
      </footer>
    </div>
  )
}
