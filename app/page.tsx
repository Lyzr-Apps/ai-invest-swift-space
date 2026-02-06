'use client'

/**
 * StockAI - Enhanced AI-Powered Financial Intelligence Platform
 * Complete homepage with hero, features, and real company showcase
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  TrendingUp,
  BarChart3,
  Newspaper,
  Brain,
  BookOpen,
  Target,
  Shield,
  Zap,
  ArrowRight,
  Activity,
  Star,
  TrendingDown,
  ChevronRight
} from 'lucide-react'

// ============================================================================
// Types and Data
// ============================================================================

interface StockData {
  ticker: string
  name: string
  price: number
  change: number
  changePercent: number
  logo?: string
}

const POPULAR_STOCKS: StockData[] = [
  { ticker: 'AAPL', name: 'Apple Inc.', price: 187.42, change: 2.31, changePercent: 1.25 },
  { ticker: 'MSFT', name: 'Microsoft Corporation', price: 378.91, change: -1.45, changePercent: -0.38 },
  { ticker: 'GOOGL', name: 'Alphabet Inc.', price: 141.80, change: 3.22, changePercent: 2.32 },
  { ticker: 'AMZN', name: 'Amazon.com Inc.', price: 178.35, change: 4.67, changePercent: 2.69 },
  { ticker: 'TSLA', name: 'Tesla Inc.', price: 242.84, change: -5.12, changePercent: -2.07 },
  { ticker: 'NVDA', name: 'NVIDIA Corporation', price: 875.28, change: 12.45, changePercent: 1.44 },
  { ticker: 'META', name: 'Meta Platforms Inc.', price: 484.03, change: 7.89, changePercent: 1.66 }
]

// ============================================================================
// Animated Market Graph Component
// ============================================================================

function AnimatedMarketGraph() {
  const [points, setPoints] = useState<number[]>([])

  useEffect(() => {
    const generatePoints = () => {
      const newPoints = []
      let value = 50
      for (let i = 0; i < 60; i++) {
        value += (Math.random() - 0.45) * 8
        value = Math.max(20, Math.min(80, value))
        newPoints.push(value)
      }
      return newPoints
    }

    setPoints(generatePoints())

    const interval = setInterval(() => {
      setPoints(prev => {
        const newPoints = [...prev.slice(1)]
        let lastValue = prev[prev.length - 1]
        lastValue += (Math.random() - 0.45) * 8
        lastValue = Math.max(20, Math.min(80, lastValue))
        newPoints.push(lastValue)
        return newPoints
      })
    }, 80)

    return () => clearInterval(interval)
  }, [])

  const pathData = points.map((y, i) => {
    const x = (i / (points.length - 1)) * 100
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
  }).join(' ')

  return (
    <div className="w-full h-80 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0D1117] to-[#1a1f2e] border border-[#3B82F6]/20 shadow-2xl">
      <div className="absolute top-4 left-4 z-10">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-[#3B82F6]" />
          <span className="text-sm font-medium text-white">Live Market Simulation</span>
        </div>
      </div>

      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="graphGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path
          d={`${pathData} L 100 100 L 0 100 Z`}
          fill="url(#graphGradient)"
        />
        <path
          d={pathData}
          fill="none"
          stroke="#3B82F6"
          strokeWidth="0.6"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="absolute bottom-4 right-4 text-xs text-[#64748B]">
        Real-time data visualization
      </div>
    </div>
  )
}

// ============================================================================
// Stock Search Component
// ============================================================================

interface StockSearchProps {
  onSearch: (ticker: string) => void
  placeholder?: string
  className?: string
}

function StockSearch({ onSearch, placeholder, className = '' }: StockSearchProps) {
  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredStocks, setFilteredStocks] = useState<StockData[]>([])

  useEffect(() => {
    if (query.trim()) {
      const filtered = POPULAR_STOCKS.filter(stock =>
        stock.ticker.toLowerCase().includes(query.toLowerCase()) ||
        stock.name.toLowerCase().includes(query.toLowerCase())
      )
      setFilteredStocks(filtered)
      setShowSuggestions(true)
    } else {
      setFilteredStocks([])
      setShowSuggestions(false)
    }
  }, [query])

  const handleSelect = (ticker: string) => {
    setQuery(ticker)
    setShowSuggestions(false)
    onSearch(ticker)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      setShowSuggestions(false)
      onSearch(query.toUpperCase())
    }
  }

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#64748B]" />
          <Input
            type="text"
            placeholder={placeholder || "Search stocks (e.g., AAPL, MSFT, TSLA)..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query && setShowSuggestions(true)}
            className="pl-12 pr-4 py-6 text-lg bg-[#0D1117]/80 border-[#64748B]/30 text-white placeholder:text-[#64748B] focus:border-[#3B82F6] focus:ring-[#3B82F6]/20"
          />
        </div>
      </form>

      {showSuggestions && filteredStocks.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-[#0D1117] border border-[#64748B]/30 rounded-lg shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto">
          {filteredStocks.map((stock) => (
            <button
              key={stock.ticker}
              onClick={() => handleSelect(stock.ticker)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#3B82F6]/10 transition-colors border-b border-[#64748B]/10 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <span className="font-semibold text-white">{stock.ticker}</span>
                <span className="text-sm text-[#64748B]">{stock.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white font-medium">${stock.price.toFixed(2)}</span>
                <span className={`text-sm font-medium ${stock.change >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                  {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Real Companies Showcase
// ============================================================================

function RealCompaniesShowcase() {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <Badge className="mb-4 bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/30 text-sm px-4 py-1">
          Real Market Data
        </Badge>
        <h3 className="text-3xl font-bold text-white mb-2">
          Analyze Real-World Companies
        </h3>
        <p className="text-[#64748B] text-lg">
          Live data from the world's most traded stocks
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {POPULAR_STOCKS.map((stock) => (
          <Link key={stock.ticker} href={`/stock/${stock.ticker}`}>
            <Card className="bg-[#0D1117]/60 border-[#64748B]/20 hover:border-[#3B82F6]/50 transition-all duration-300 cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-2xl font-bold text-white group-hover:text-[#3B82F6] transition-colors">
                      {stock.ticker}
                    </h4>
                    <p className="text-xs text-[#64748B] mt-1 line-clamp-1">{stock.name}</p>
                  </div>
                  {stock.change >= 0 ? (
                    <TrendingUp className="h-5 w-5 text-[#10B981]" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-[#EF4444]" />
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-semibold text-white">
                      ${stock.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${stock.change >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                      {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
                    </span>
                    <span className={`text-sm font-medium ${stock.change >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                      ({stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[#64748B]/10">
                  <div className="flex items-center justify-between text-sm text-[#64748B] group-hover:text-[#3B82F6] transition-colors">
                    <span>View Analysis</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}

// ============================================================================
// Feature Card Component
// ============================================================================

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  highlight?: boolean
}

function FeatureCard({ icon, title, description, highlight = false }: FeatureCardProps) {
  return (
    <Card className={`${highlight ? 'bg-[#3B82F6]/10 border-[#3B82F6]/40' : 'bg-[#0D1117]/60 border-[#64748B]/20'} backdrop-blur-sm hover:border-[#3B82F6]/50 transition-all duration-300`}>
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-[#3B82F6]/20 text-[#3B82F6]">
            {icon}
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl text-white mb-2">{title}</CardTitle>
            <p className="text-[#64748B] leading-relaxed">{description}</p>
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}

// ============================================================================
// Key Features Section
// ============================================================================

function KeyFeatures() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h3 className="text-4xl font-bold text-white mb-4">
          Everything You Need to Invest Smarter
        </h3>
        <p className="text-xl text-[#64748B] max-w-3xl mx-auto">
          Comprehensive AI-powered analysis with explainable insights and educational content
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <FeatureCard
          icon={<Brain className="h-6 w-6" />}
          title="AI Chatbot Analyst"
          description="Ask natural language questions about any stock. Get instant, data-grounded answers with citations, educational tips, and confidence levels."
          highlight={true}
        />

        <FeatureCard
          icon={<Target className="h-6 w-6" />}
          title="Executive Summary"
          description="Clear INVEST/HOLD/AVOID verdicts with confidence percentages, risk levels, and time horizons. Know the bottom line in 30 seconds."
          highlight={true}
        />

        <FeatureCard
          icon={<BarChart3 className="h-6 w-6" />}
          title="Technical Analysis"
          description="Advanced indicators including RSI, MACD, moving averages, and volume trends. Every signal backed by specific data points and dates."
        />

        <FeatureCard
          icon={<TrendingUp className="h-6 w-6" />}
          title="Fundamental Insights"
          description="Deep dive into P/E ratios, debt levels, earnings growth, and sector comparisons. Understand exactly why a stock is valued the way it is."
        />

        <FeatureCard
          icon={<Newspaper className="h-6 w-6" />}
          title="News Sentiment Analysis"
          description="Real-time sentiment from trusted sources. See which articles are moving the market and their potential impact with sentiment scores."
        />

        <FeatureCard
          icon={<Activity className="h-6 w-6" />}
          title="Sector Trends Analysis"
          description="Understand how stocks perform relative to their sector. Compare to peers, identify industry trends, and spot rotation signals."
        />

        <FeatureCard
          icon={<BookOpen className="h-6 w-6" />}
          title="Learning Hub"
          description="Structured educational content for students and professionals. From basics to advanced strategies, with interactive examples using real stocks."
          highlight={true}
        />

        <FeatureCard
          icon={<Shield className="h-6 w-6" />}
          title="Scenario Analysis"
          description="Future outlook with optimistic, neutral, and pessimistic scenarios. Clear disclaimers and conditional triggers for responsible investing."
          highlight={true}
        />
      </div>
    </section>
  )
}

// ============================================================================
// Why StockAI Section
// ============================================================================

function WhyStockAI() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-gradient-to-br from-[#3B82F6]/10 to-[#0D1117]/60 border-[#3B82F6]/30 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <Zap className="h-8 w-8 text-[#3B82F6]" />
              <CardTitle className="text-3xl text-white">
                Why StockAI?
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-[#F59E0B]" />
                  <h4 className="text-lg font-semibold text-white">For Students</h4>
                </div>
                <p className="text-[#64748B]">
                  Learn investing fundamentals with interactive lessons tied to real market examples. Build confidence before risking real money.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-[#F59E0B]" />
                  <h4 className="text-lg font-semibold text-white">For Professionals</h4>
                </div>
                <p className="text-[#64748B]">
                  Get institutional-grade analysis without expensive Bloomberg terminals. Make data-driven decisions backed by multi-agent AI.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-[#F59E0B]" />
                  <h4 className="text-lg font-semibold text-white">For Retail Investors</h4>
                </div>
                <p className="text-[#64748B]">
                  Level the playing field with AI that explains every recommendation. No black boxes, just transparent, grounded insights.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-[#64748B]/20">
              <h4 className="text-lg font-semibold text-white mb-3">Data-Grounded AI You Can Trust</h4>
              <ul className="space-y-2 text-[#64748B]">
                <li className="flex items-start gap-2">
                  <span className="text-[#10B981] mt-1">✓</span>
                  <span>Every verdict comes with specific citations: "RSI at 66.7 (neutral)", "MACD bullish crossover on Oct 12"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10B981] mt-1">✓</span>
                  <span>Multi-agent system: Separate AI specialists for technical, fundamental, sentiment, and sector analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10B981] mt-1">✓</span>
                  <span>Transparent confidence levels and risk ratings on all recommendations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10B981] mt-1">✓</span>
                  <span>Educational chatbot that explains concepts while answering your questions</span>
                </li>
              </ul>
            </div>

            <div className="pt-4">
              <p className="text-white font-medium text-lg text-center">
                Make informed decisions backed by data, not guesswork.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

// ============================================================================
// Main Homepage Component
// ============================================================================

export default function Home() {
  const handleSearch = (ticker: string) => {
    window.location.href = `/stock/${ticker}`
  }

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

            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/learn"
                className="text-[#64748B] hover:text-[#3B82F6] transition-colors font-medium"
              >
                Learning Hub
              </Link>
              <Link
                href="/watchlist"
                className="text-[#64748B] hover:text-[#3B82F6] transition-colors font-medium"
              >
                Watchlist
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <StockSearch
                onSearch={handleSearch}
                placeholder="Quick search..."
                className="hidden lg:block w-64"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <Badge className="bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/30 text-sm px-4 py-1">
              AI-Powered Financial Intelligence
            </Badge>

            <h2 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Understand Stocks
              <br />
              with AI.{' '}
              <span className="text-[#3B82F6]">Don't Guess.</span>
            </h2>

            <p className="text-xl md:text-2xl text-[#64748B] max-w-3xl mx-auto">
              Institutional-grade analysis for <span className="text-white font-medium">students</span>,{' '}
              <span className="text-white font-medium">working professionals</span>, and{' '}
              <span className="text-white font-medium">retail investors</span>.
              <br />
              Get data-grounded insights in 30 seconds.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/learn">
              <Button
                size="lg"
                className="px-8 py-6 text-lg bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white group"
              >
                <BookOpen className="h-5 w-5 mr-2" />
                Start Learning
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Button
              size="lg"
              variant="outline"
              className="px-8 py-6 text-lg border-[#64748B]/30 text-white hover:bg-[#64748B]/10"
              onClick={() => {
                const stocksSection = document.getElementById('stocks-section')
                stocksSection?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              <Search className="h-5 w-5 mr-2" />
              Explore Stocks
            </Button>
          </div>

          <div className="pt-8">
            <StockSearch
              onSearch={handleSearch}
              className="max-w-2xl mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Animated Market Graph */}
      <section className="container mx-auto px-4 py-8">
        <AnimatedMarketGraph />
      </section>

      {/* Real Companies Showcase */}
      <div id="stocks-section">
        <RealCompaniesShowcase />
      </div>

      {/* Key Features */}
      <KeyFeatures />

      {/* Why StockAI */}
      <WhyStockAI />

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-gradient-to-r from-[#3B82F6]/20 to-[#0D1117]/60 border-[#3B82F6]/40 backdrop-blur-sm">
            <CardContent className="p-12">
              <h3 className="text-3xl font-bold text-white mb-4">
                Ready to Make Smarter Investment Decisions?
              </h3>
              <p className="text-xl text-[#64748B] mb-8">
                Join thousands of investors using AI to understand the market
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/stock/AAPL">
                  <Button
                    size="lg"
                    className="px-8 py-6 text-lg bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white"
                  >
                    Try with Apple Stock
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/learn">
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 py-6 text-lg border-[#64748B]/30 text-white hover:bg-[#64748B]/10"
                  >
                    <BookOpen className="h-5 w-5 mr-2" />
                    Visit Learning Hub
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#64748B]/20 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-[#3B82F6]" />
              <span className="text-white font-semibold">StockAI</span>
            </div>

            <div className="flex items-center gap-6">
              <Link href="/learn" className="text-[#64748B] hover:text-[#3B82F6] transition-colors">
                Learning Hub
              </Link>
              <Link href="/watchlist" className="text-[#64748B] hover:text-[#3B82F6] transition-colors">
                Watchlist
              </Link>
            </div>

            <p className="text-[#64748B] text-sm">
              AI-Powered Financial Intelligence Platform
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-[#64748B]/10 text-center">
            <p className="text-[#64748B] text-sm">
              StockAI is for educational and informational purposes only. Not financial advice.
              <br />
              Always consult with a qualified financial advisor before making investment decisions.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
