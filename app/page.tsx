'use client'

/**
 * StockAI - Institutional-grade stock analysis with AI
 * Complete landing page and stock analysis interface
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { callAIAgent } from '@/lib/aiAgent'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Search,
  TrendingUp,
  BarChart3,
  Newspaper,
  ChevronDown,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Activity
} from 'lucide-react'

// ============================================================================
// TypeScript Interfaces from Response Schemas
// ============================================================================

interface TechnicalAnalysisResult {
  rsi: number
  rsiSignal: string
  macd: string
  macdDate: string
  ma50: number
  ma200: number
  priceVsMa: string
  volumeTrend: string
  overallSignal: string
}

interface FundamentalAnalysisResult {
  peRatio: number
  sectorAvgPE: number
  debtToEquity: number
  earningsGrowthYoY: number
  revenueGrowthYoY: number
  healthScore: number
  fundamentalSignal: string
  concerns: string[]
  strengths: string[]
}

interface NewsArticle {
  title: string
  source: string
  date: string
  sentiment: string
  impact: string
}

interface NewsSentimentResult {
  overallSentiment: string
  sentimentScore: number
  articleCount: number
  articles: NewsArticle[]
  keyEvents: string[]
  sentimentTrend: string
}

interface StockAnalysisResult {
  verdict: string
  confidence: number
  risk: string
  technicalSummary: string
  fundamentalSummary: string
  sentimentSummary: string
  explanation: string
}

// Agent IDs
const AGENT_IDS = {
  coordinator: '6985a0d88ce1fc653cfdee14',
  technical: '6985a0a3094c8b2d4207dd88',
  fundamental: '6985a0b2301c62c7ca2c7d76',
  sentiment: '6985a0c3e17e33c11eed1b22'
}

// ============================================================================
// Stock Data Type
// ============================================================================

interface StockData {
  ticker: string
  name: string
  price: number
  change: number
  changePercent: number
}

// Mock stock data for autocomplete
const POPULAR_STOCKS: StockData[] = [
  { ticker: 'AAPL', name: 'Apple Inc.', price: 187.42, change: 2.31, changePercent: 1.25 },
  { ticker: 'MSFT', name: 'Microsoft Corporation', price: 378.91, change: -1.45, changePercent: -0.38 },
  { ticker: 'GOOGL', name: 'Alphabet Inc.', price: 141.80, change: 3.22, changePercent: 2.32 },
  { ticker: 'AMZN', name: 'Amazon.com Inc.', price: 178.35, change: 4.67, changePercent: 2.69 },
  { ticker: 'TSLA', name: 'Tesla Inc.', price: 242.84, change: -5.12, changePercent: -2.07 },
  { ticker: 'NVDA', name: 'NVIDIA Corporation', price: 875.28, change: 12.45, changePercent: 1.44 },
  { ticker: 'META', name: 'Meta Platforms Inc.', price: 484.03, change: 7.89, changePercent: 1.66 },
]

// ============================================================================
// Animated Graph Component
// ============================================================================

function AnimatedGraph() {
  const [points, setPoints] = useState<number[]>([])

  useEffect(() => {
    // Generate initial points
    const generatePoints = () => {
      const newPoints = []
      let value = 50
      for (let i = 0; i < 50; i++) {
        value += (Math.random() - 0.5) * 10
        value = Math.max(20, Math.min(80, value))
        newPoints.push(value)
      }
      return newPoints
    }

    setPoints(generatePoints())

    // Animate by shifting points
    const interval = setInterval(() => {
      setPoints(prev => {
        const newPoints = [...prev.slice(1)]
        let lastValue = prev[prev.length - 1]
        lastValue += (Math.random() - 0.5) * 10
        lastValue = Math.max(20, Math.min(80, lastValue))
        newPoints.push(lastValue)
        return newPoints
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  const pathData = points.map((y, i) => {
    const x = (i / (points.length - 1)) * 100
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
  }).join(' ')

  return (
    <div className="w-full h-64 relative overflow-hidden rounded-lg bg-gradient-to-br from-[#0D1117]/50 to-[#0D1117]/80 border border-[#3B82F6]/20">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path
          d={`${pathData} L 100 100 L 0 100 Z`}
          fill="url(#gradient)"
        />
        <path
          d={pathData}
          fill="none"
          stroke="#3B82F6"
          strokeWidth="0.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  )
}

// ============================================================================
// Feature Card Component
// ============================================================================

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="bg-[#0D1117]/60 border-[#64748B]/20 backdrop-blur-sm hover:border-[#3B82F6]/40 transition-all duration-300">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-[#3B82F6]/10 text-[#3B82F6]">
            {icon}
          </div>
          <CardTitle className="text-xl text-white">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-[#64748B] leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// Stock Search Component
// ============================================================================

interface StockSearchProps {
  onSelectStock: (ticker: string) => void
}

function StockSearch({ onSelectStock }: StockSearchProps) {
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
    onSelectStock(ticker)
  }

  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#64748B]" />
        <Input
          type="text"
          placeholder="Search stocks (e.g., AAPL, MSFT, TSLA)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setShowSuggestions(true)}
          className="pl-12 pr-4 py-6 text-lg bg-[#0D1117]/80 border-[#64748B]/30 text-white placeholder:text-[#64748B] focus:border-[#3B82F6] focus:ring-[#3B82F6]/20"
        />
      </div>

      {showSuggestions && filteredStocks.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-[#0D1117] border border-[#64748B]/30 rounded-lg shadow-2xl overflow-hidden z-50">
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
                <span className={`text-sm ${stock.change >= 0 ? 'text-[#F59E0B]' : 'text-[#EF4444]'}`}>
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
// Golden Card Component (Verdict Display)
// ============================================================================

interface GoldenCardProps {
  result: StockAnalysisResult
  stockData: StockData
}

function GoldenCard({ result, stockData }: GoldenCardProps) {
  const getVerdictColor = (verdict: string) => {
    const v = verdict.toLowerCase()
    if (v.includes('bullish')) return 'text-[#F59E0B]'
    if (v.includes('bearish')) return 'text-[#EF4444]'
    return 'text-[#64748B]'
  }

  const getVerdictBg = (verdict: string) => {
    const v = verdict.toLowerCase()
    if (v.includes('bullish')) return 'bg-[#F59E0B]/10 border-[#F59E0B]/30'
    if (v.includes('bearish')) return 'bg-[#EF4444]/10 border-[#EF4444]/30'
    return 'bg-[#64748B]/10 border-[#64748B]/30'
  }

  const getRiskColor = (risk: string) => {
    const r = risk.toLowerCase()
    if (r.includes('low')) return 'text-[#10B981]'
    if (r.includes('high')) return 'text-[#EF4444]'
    return 'text-[#F59E0B]'
  }

  return (
    <Card className={`${getVerdictBg(result.verdict)} backdrop-blur-sm border-2 animate-in fade-in slide-in-from-bottom-4 duration-500`}>
      <CardContent className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Stock Info */}
          <div className="space-y-4">
            <div>
              <div className="flex items-baseline gap-3 mb-2">
                <h2 className="text-4xl font-bold text-white">{stockData.ticker}</h2>
                <span className="text-lg text-[#64748B]">{stockData.name}</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-semibold text-white">${stockData.price.toFixed(2)}</span>
                <span className={`text-lg ${stockData.change >= 0 ? 'text-[#F59E0B]' : 'text-[#EF4444]'}`}>
                  {stockData.change >= 0 ? '+' : ''}{stockData.change.toFixed(2)} ({stockData.changePercent >= 0 ? '+' : ''}{stockData.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>

            {/* Verdict Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getVerdictBg(result.verdict)} border`}>
              <span className={`text-2xl font-bold ${getVerdictColor(result.verdict)}`}>
                {result.verdict}
              </span>
            </div>
          </div>

          {/* Right: Metrics */}
          <div className="space-y-4">
            {/* Confidence */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#64748B] uppercase tracking-wide">Confidence</span>
                <span className="text-2xl font-bold text-white">{result.confidence}%</span>
              </div>
              <div className="w-full h-3 bg-[#0D1117]/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#3B82F6] to-[#F59E0B] transition-all duration-1000 ease-out"
                  style={{ width: `${result.confidence}%` }}
                />
              </div>
            </div>

            {/* Risk Level */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#64748B] uppercase tracking-wide">Risk Level</span>
                <span className={`text-xl font-semibold ${getRiskColor(result.risk)}`}>
                  {result.risk}
                </span>
              </div>
            </div>

            {/* Summary */}
            <div className="pt-2">
              <p className="text-sm text-[#64748B] leading-relaxed">
                {result.explanation}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// Analysis Panel Component
// ============================================================================

interface AnalysisPanelProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}

function AnalysisPanel({ title, icon, children }: AnalysisPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <Card className="bg-[#0D1117]/60 border-[#64748B]/20 backdrop-blur-sm">
      <CardHeader
        className="cursor-pointer hover:bg-[#3B82F6]/5 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#3B82F6]/10 text-[#3B82F6]">
              {icon}
            </div>
            <CardTitle className="text-xl text-white">{title}</CardTitle>
          </div>
          <ChevronDown
            className={`h-5 w-5 text-[#64748B] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
          />
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="animate-in slide-in-from-top-2 duration-300">
          {children}
        </CardContent>
      )}
    </Card>
  )
}

// ============================================================================
// Technical Analysis Display
// ============================================================================

interface TechnicalAnalysisDisplayProps {
  data: TechnicalAnalysisResult
  summary: string
}

function TechnicalAnalysisDisplay({ data, summary }: TechnicalAnalysisDisplayProps) {
  return (
    <div className="space-y-4">
      <p className="text-[#64748B] leading-relaxed">{summary}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* RSI */}
        <div className="p-4 bg-[#0D1117]/50 rounded-lg border border-[#64748B]/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#64748B]">RSI</span>
            <span className="text-lg font-semibold text-white">{data.rsi.toFixed(1)}</span>
          </div>
          <div className="text-xs text-[#3B82F6]">{data.rsiSignal}</div>
        </div>

        {/* MACD */}
        <div className="p-4 bg-[#0D1117]/50 rounded-lg border border-[#64748B]/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#64748B]">MACD</span>
            <span className="text-lg font-semibold text-white">{data.macd}</span>
          </div>
          <div className="text-xs text-[#3B82F6]">Crossover on {data.macdDate}</div>
        </div>

        {/* MA50 */}
        <div className="p-4 bg-[#0D1117]/50 rounded-lg border border-[#64748B]/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#64748B]">50-Day MA</span>
            <span className="text-lg font-semibold text-white">${data.ma50.toFixed(2)}</span>
          </div>
          <div className="text-xs text-[#3B82F6]">Price {data.priceVsMa} MA</div>
        </div>

        {/* MA200 */}
        <div className="p-4 bg-[#0D1117]/50 rounded-lg border border-[#64748B]/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#64748B]">200-Day MA</span>
            <span className="text-lg font-semibold text-white">${data.ma200.toFixed(2)}</span>
          </div>
          <div className="text-xs text-[#3B82F6]">Volume {data.volumeTrend}</div>
        </div>
      </div>

      <div className="p-4 bg-[#3B82F6]/10 rounded-lg border border-[#3B82F6]/20">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-[#3B82F6]" />
          <span className="text-sm font-medium text-white">Overall Signal: {data.overallSignal}</span>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Fundamental Analysis Display
// ============================================================================

interface FundamentalAnalysisDisplayProps {
  data: FundamentalAnalysisResult
  summary: string
}

function FundamentalAnalysisDisplay({ data, summary }: FundamentalAnalysisDisplayProps) {
  return (
    <div className="space-y-4">
      <p className="text-[#64748B] leading-relaxed">{summary}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* P/E Ratio */}
        <div className="p-4 bg-[#0D1117]/50 rounded-lg border border-[#64748B]/10">
          <div className="text-sm text-[#64748B] mb-1">P/E Ratio</div>
          <div className="text-2xl font-semibold text-white">{data.peRatio.toFixed(1)}</div>
          <div className="text-xs text-[#3B82F6] mt-1">Sector Avg: {data.sectorAvgPE.toFixed(1)}</div>
        </div>

        {/* Debt to Equity */}
        <div className="p-4 bg-[#0D1117]/50 rounded-lg border border-[#64748B]/10">
          <div className="text-sm text-[#64748B] mb-1">Debt/Equity</div>
          <div className="text-2xl font-semibold text-white">{data.debtToEquity.toFixed(2)}</div>
          <div className="text-xs text-[#3B82F6] mt-1">Leverage ratio</div>
        </div>

        {/* Health Score */}
        <div className="p-4 bg-[#0D1117]/50 rounded-lg border border-[#64748B]/10">
          <div className="text-sm text-[#64748B] mb-1">Health Score</div>
          <div className="text-2xl font-semibold text-white">{data.healthScore}/100</div>
          <div className="text-xs text-[#3B82F6] mt-1">{data.fundamentalSignal}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Earnings Growth */}
        <div className="p-4 bg-[#0D1117]/50 rounded-lg border border-[#64748B]/10">
          <div className="text-sm text-[#64748B] mb-1">Earnings Growth (YoY)</div>
          <div className="text-xl font-semibold text-[#F59E0B]">+{data.earningsGrowthYoY.toFixed(1)}%</div>
        </div>

        {/* Revenue Growth */}
        <div className="p-4 bg-[#0D1117]/50 rounded-lg border border-[#64748B]/10">
          <div className="text-sm text-[#64748B] mb-1">Revenue Growth (YoY)</div>
          <div className="text-xl font-semibold text-[#F59E0B]">+{data.revenueGrowthYoY.toFixed(1)}%</div>
        </div>
      </div>

      {/* Strengths */}
      {data.strengths.length > 0 && (
        <div className="p-4 bg-[#10B981]/10 rounded-lg border border-[#10B981]/20">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
            <span className="text-sm font-medium text-white">Strengths</span>
          </div>
          <ul className="space-y-1">
            {data.strengths.map((strength, i) => (
              <li key={i} className="text-sm text-[#64748B] ml-6">• {strength}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Concerns */}
      {data.concerns.length > 0 && (
        <div className="p-4 bg-[#EF4444]/10 rounded-lg border border-[#EF4444]/20">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-[#EF4444]" />
            <span className="text-sm font-medium text-white">Concerns</span>
          </div>
          <ul className="space-y-1">
            {data.concerns.map((concern, i) => (
              <li key={i} className="text-sm text-[#64748B] ml-6">• {concern}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// News Sentiment Display
// ============================================================================

interface NewsSentimentDisplayProps {
  data: NewsSentimentResult
  summary: string
}

function NewsSentimentDisplay({ data, summary }: NewsSentimentDisplayProps) {
  const getSentimentColor = (sentiment: string) => {
    const s = sentiment.toLowerCase()
    if (s.includes('positive')) return 'bg-[#10B981]/10 border-[#10B981]/30 text-[#10B981]'
    if (s.includes('negative')) return 'bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]'
    return 'bg-[#64748B]/10 border-[#64748B]/30 text-[#64748B]'
  }

  const getImpactColor = (impact: string) => {
    const i = impact.toLowerCase()
    if (i.includes('high')) return 'text-[#EF4444]'
    if (i.includes('low')) return 'text-[#64748B]'
    return 'text-[#F59E0B]'
  }

  return (
    <div className="space-y-4">
      <p className="text-[#64748B] leading-relaxed">{summary}</p>

      {/* Sentiment Score */}
      <div className="p-4 bg-[#0D1117]/50 rounded-lg border border-[#64748B]/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-[#64748B]">Overall Sentiment Score</span>
          <span className="text-2xl font-bold text-white">{data.sentimentScore}/100</span>
        </div>
        <div className="w-full h-3 bg-[#0D1117]/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#EF4444] via-[#64748B] to-[#10B981] transition-all duration-1000"
            style={{ width: `${data.sentimentScore}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2 text-xs">
          <span className="text-[#EF4444]">Negative</span>
          <span className="text-[#64748B]">Neutral</span>
          <span className="text-[#10B981]">Positive</span>
        </div>
      </div>

      {/* Key Events */}
      {data.keyEvents.length > 0 && (
        <div className="p-4 bg-[#3B82F6]/10 rounded-lg border border-[#3B82F6]/20">
          <div className="flex items-center gap-2 mb-2">
            <Newspaper className="h-4 w-4 text-[#3B82F6]" />
            <span className="text-sm font-medium text-white">Key Events</span>
          </div>
          <ul className="space-y-1">
            {data.keyEvents.map((event, i) => (
              <li key={i} className="text-sm text-[#64748B] ml-6">• {event}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Articles */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-white">Recent Articles ({data.articleCount})</span>
          <span className="text-sm text-[#64748B]">Trend: {data.sentimentTrend}</span>
        </div>
        {data.articles.map((article, i) => (
          <div key={i} className="p-4 bg-[#0D1117]/50 rounded-lg border border-[#64748B]/10 hover:border-[#3B82F6]/30 transition-colors">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h4 className="text-white font-medium flex-1">{article.title}</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSentimentColor(article.sentiment)}`}>
                {article.sentiment}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3 text-[#64748B]">
                <span>{article.source}</span>
                <span>•</span>
                <span>{article.date}</span>
              </div>
              <span className={`text-xs font-medium ${getImpactColor(article.impact)}`}>
                {article.impact} impact
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// Main Page Component
// ============================================================================

export default function Home() {
  const [selectedStock, setSelectedStock] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analysisResult, setAnalysisResult] = useState<StockAnalysisResult | null>(null)
  const [technicalData, setTechnicalData] = useState<TechnicalAnalysisResult | null>(null)
  const [fundamentalData, setFundamentalData] = useState<FundamentalAnalysisResult | null>(null)
  const [sentimentData, setSentimentData] = useState<NewsSentimentResult | null>(null)

  // Get stock data
  const getStockData = (ticker: string): StockData => {
    const stock = POPULAR_STOCKS.find(s => s.ticker === ticker)
    return stock || {
      ticker,
      name: `${ticker} Inc.`,
      price: 150.00,
      change: 2.50,
      changePercent: 1.69
    }
  }

  const analyzeStock = async (ticker: string) => {
    setLoading(true)
    setError(null)
    setAnalysisResult(null)
    setTechnicalData(null)
    setFundamentalData(null)
    setSentimentData(null)

    try {
      const stockData = getStockData(ticker)

      // Call coordinator agent for overall analysis
      const coordinatorResult = await callAIAgent(
        `Analyze ${ticker} stock. Current price: $${stockData.price.toFixed(2)}`,
        AGENT_IDS.coordinator
      )

      if (!coordinatorResult.success) {
        throw new Error(coordinatorResult.error || 'Failed to get analysis')
      }

      // Parse coordinator response
      if (coordinatorResult.response?.status === 'success' && coordinatorResult.response?.result) {
        setAnalysisResult(coordinatorResult.response.result as StockAnalysisResult)
      }

      // Call individual agents for detailed data
      const [technicalResult, fundamentalResult, sentimentResult] = await Promise.all([
        callAIAgent(`Provide technical analysis for ${ticker}`, AGENT_IDS.technical),
        callAIAgent(`Provide fundamental analysis for ${ticker}`, AGENT_IDS.fundamental),
        callAIAgent(`Provide news sentiment analysis for ${ticker}`, AGENT_IDS.sentiment)
      ])

      // Parse technical analysis
      if (technicalResult.success && technicalResult.response?.result) {
        setTechnicalData(technicalResult.response.result as TechnicalAnalysisResult)
      }

      // Parse fundamental analysis
      if (fundamentalResult.success && fundamentalResult.response?.result) {
        setFundamentalData(fundamentalResult.response.result as FundamentalAnalysisResult)
      }

      // Parse sentiment analysis
      if (sentimentResult.success && sentimentResult.response?.result) {
        setSentimentData(sentimentResult.response.result as NewsSentimentResult)
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectStock = (ticker: string) => {
    setSelectedStock(ticker)
    analyzeStock(ticker)
  }

  const handleReset = () => {
    setSelectedStock(null)
    setAnalysisResult(null)
    setTechnicalData(null)
    setFundamentalData(null)
    setSentimentData(null)
    setError(null)
  }

  // Landing Page View
  if (!selectedStock) {
    return (
      <div className="min-h-screen bg-[#0D1117]">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-[#0D1117]/80 backdrop-blur-lg border-b border-[#64748B]/20">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-8 w-8 text-[#3B82F6]" />
                <h1 className="text-2xl font-bold text-white">StockAI</h1>
              </div>
              <div className="flex-1 max-w-2xl mx-8">
                <StockSearch onSelectStock={handleSelectStock} />
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-5xl md:text-6xl font-bold text-white leading-tight">
              Understand Stocks with AI.
              <br />
              <span className="text-[#3B82F6]">Don't Guess.</span>
            </h2>
            <p className="text-xl text-[#64748B] max-w-2xl mx-auto">
              Institutional-grade stock analysis powered by AI. Get data-grounded insights
              from technical indicators, fundamental metrics, and real-time news sentiment.
            </p>
            <div className="flex justify-center">
              <StockSearch onSelectStock={handleSelectStock} />
            </div>
          </div>
        </section>

        {/* Animated Graph */}
        <section className="container mx-auto px-4 py-8">
          <AnimatedGraph />
        </section>

        {/* Feature Cards */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<BarChart3 className="h-6 w-6" />}
              title="Technical Analysis"
              description="Advanced charting with RSI, MACD, moving averages, and volume analysis. Every signal is backed by specific data points and dates."
            />
            <FeatureCard
              icon={<TrendingUp className="h-6 w-6" />}
              title="Fundamental Insights"
              description="Deep dive into P/E ratios, debt levels, earnings growth, and sector comparisons. Know exactly why a stock is valued the way it is."
            />
            <FeatureCard
              icon={<Newspaper className="h-6 w-6" />}
              title="News Sentiment"
              description="Real-time sentiment analysis from trusted sources. See which articles are moving the market and their potential impact."
            />
          </div>
        </section>

        {/* Why AI Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <Card className="bg-[#0D1117]/60 border-[#3B82F6]/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-white text-center">
                  Why Data-Grounded AI?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-[#64748B] leading-relaxed">
                <p>
                  Traditional stock analysis tools show you raw data. StockAI goes further by
                  synthesizing technical indicators, fundamental metrics, and news sentiment into
                  clear, actionable insights.
                </p>
                <p>
                  Every verdict comes with specific citations: "RSI at 66.7 (neutral)",
                  "MACD bullish crossover on Oct 12", "P/E 28.5 vs sector avg 24.0".
                  You'll never wonder where a recommendation came from.
                </p>
                <p className="text-white font-medium">
                  Make informed decisions backed by data, not guesswork.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    )
  }

  // Stock Analysis View
  const stockData = getStockData(selectedStock)

  return (
    <div className="min-h-screen bg-[#0D1117]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0D1117]/80 backdrop-blur-lg border-b border-[#64748B]/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 text-[#3B82F6] hover:text-[#3B82F6]/80 transition-colors"
            >
              <TrendingUp className="h-8 w-8" />
              <h1 className="text-2xl font-bold">StockAI</h1>
            </button>
            <div className="flex-1 max-w-2xl mx-8">
              <StockSearch onSelectStock={handleSelectStock} />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Loading State */}
        {loading && (
          <Card className="bg-[#0D1117]/60 border-[#3B82F6]/30 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center justify-center gap-4">
                <Loader2 className="h-8 w-8 text-[#3B82F6] animate-spin" />
                <div className="text-center">
                  <p className="text-lg text-white font-medium">Analyzing {selectedStock}...</p>
                  <p className="text-sm text-[#64748B]">Gathering technical, fundamental, and sentiment data</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card className="bg-[#EF4444]/10 border-[#EF4444]/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <XCircle className="h-6 w-6 text-[#EF4444]" />
                <div>
                  <p className="text-white font-medium">Analysis Error</p>
                  <p className="text-sm text-[#64748B]">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Golden Card - Verdict */}
        {analysisResult && (
          <GoldenCard result={analysisResult} stockData={stockData} />
        )}

        {/* Analysis Panels */}
        {technicalData && analysisResult && (
          <AnalysisPanel
            title="Technical Analysis"
            icon={<BarChart3 className="h-5 w-5" />}
          >
            <TechnicalAnalysisDisplay
              data={technicalData}
              summary={analysisResult.technicalSummary}
            />
          </AnalysisPanel>
        )}

        {fundamentalData && analysisResult && (
          <AnalysisPanel
            title="Fundamental Analysis"
            icon={<TrendingUp className="h-5 w-5" />}
          >
            <FundamentalAnalysisDisplay
              data={fundamentalData}
              summary={analysisResult.fundamentalSummary}
            />
          </AnalysisPanel>
        )}

        {sentimentData && analysisResult && (
          <AnalysisPanel
            title="News Sentiment Analysis"
            icon={<Newspaper className="h-5 w-5" />}
          >
            <NewsSentimentDisplay
              data={sentimentData}
              summary={analysisResult.sentimentSummary}
            />
          </AnalysisPanel>
        )}

        {/* Action Button */}
        {!loading && (
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => analyzeStock(selectedStock)}
              className="px-8 py-6 text-lg bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white"
            >
              <Activity className="h-5 w-5 mr-2" />
              Re-analyze Stock
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="px-8 py-6 text-lg border-[#64748B]/30 text-white hover:bg-[#64748B]/10"
            >
              Back to Search
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
