'use client'

/**
 * StockAI Enhanced Stock Detail Page
 * Complete analysis with Executive Summary, Chatbot, Sector Analysis, Future Outlook
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Activity,
  BarChart3,
  Newspaper,
  ChevronDown,
  Send,
  Brain,
  Bookmark,
  BookmarkCheck,
  Download,
  Target,
  AlertTriangle
} from 'lucide-react'
import { callAIAgent } from '@/lib/aiAgent'
import { AGENT_IDS } from '@/lib/types'
import type {
  StockAnalysisResult,
  TechnicalAnalysisResult,
  FundamentalAnalysisResult,
  NewsSentimentResult,
  SectorTrendsResult,
  ChatMessage,
  DataPoint
} from '@/lib/types'
import {
  isInWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  getChatHistory,
  saveChatMessage,
  formatTime
} from '@/lib/watchlistHelpers'

// ============================================================================
// Mock Stock Data
// ============================================================================

const STOCK_DATA: Record<string, any> = {
  AAPL: { name: 'Apple Inc.', price: 187.42, change: 2.31, changePercent: 1.25, sector: 'Technology' },
  MSFT: { name: 'Microsoft Corporation', price: 378.91, change: -1.45, changePercent: -0.38, sector: 'Technology' },
  GOOGL: { name: 'Alphabet Inc.', price: 141.80, change: 3.22, changePercent: 2.32, sector: 'Technology' },
  AMZN: { name: 'Amazon.com Inc.', price: 178.35, change: 4.67, changePercent: 2.69, sector: 'Consumer Discretionary' },
  TSLA: { name: 'Tesla Inc.', price: 242.84, change: -5.12, changePercent: -2.07, sector: 'Automotive' },
  NVDA: { name: 'NVIDIA Corporation', price: 875.28, change: 12.45, changePercent: 1.44, sector: 'Technology' },
  META: { name: 'Meta Platforms Inc.', price: 484.03, change: 7.89, changePercent: 1.66, sector: 'Technology' }
}

// ============================================================================
// Executive Summary Card Component
// ============================================================================

interface ExecutiveSummaryProps {
  result: StockAnalysisResult
  ticker: string
  stockInfo: any
}

function ExecutiveSummaryCard({ result, ticker, stockInfo }: ExecutiveSummaryProps) {
  const getVerdictLabel = (verdict: string) => {
    const v = verdict.toLowerCase()
    if (v.includes('bullish')) return 'INVEST'
    if (v.includes('bearish')) return 'AVOID'
    return 'HOLD'
  }

  const getVerdictColor = (verdict: string) => {
    const v = verdict.toLowerCase()
    if (v.includes('bullish')) return {
      bg: 'bg-[#10B981]/10',
      border: 'border-[#10B981]/30',
      text: 'text-[#10B981]',
      icon: CheckCircle2
    }
    if (v.includes('bearish')) return {
      bg: 'bg-[#EF4444]/10',
      border: 'border-[#EF4444]/30',
      text: 'text-[#EF4444]',
      icon: XCircle
    }
    return {
      bg: 'bg-[#F59E0B]/10',
      border: 'border-[#F59E0B]/30',
      text: 'text-[#F59E0B]',
      icon: AlertCircle
    }
  }

  const verdictLabel = getVerdictLabel(result.verdict)
  const colors = getVerdictColor(result.verdict)
  const Icon = colors.icon

  const getRiskColor = (risk: string) => {
    const r = risk.toLowerCase()
    if (r.includes('low')) return 'text-[#10B981]'
    if (r.includes('high')) return 'text-[#EF4444]'
    return 'text-[#F59E0B]'
  }

  return (
    <Card className={`${colors.bg} ${colors.border} border-2 backdrop-blur-sm shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700`}>
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <Target className={`h-6 w-6 ${colors.text}`} />
          <CardTitle className="text-2xl text-white">EXECUTIVE SUMMARY</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Stock Info */}
        <div>
          <div className="flex items-baseline gap-3 mb-2">
            <h2 className="text-4xl font-bold text-white">{ticker}</h2>
            <span className="text-lg text-[#64748B]">{stockInfo.name}</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-semibold text-white">${stockInfo.price.toFixed(2)}</span>
            <span className={`text-lg font-medium ${stockInfo.change >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
              {stockInfo.change >= 0 ? '+' : ''}{stockInfo.change.toFixed(2)} ({stockInfo.change >= 0 ? '+' : ''}{stockInfo.changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        <Separator className="bg-[#64748B]/20" />

        {/* Verdict Badge */}
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-3 px-6 py-3 rounded-full ${colors.bg} ${colors.border} border-2`}>
            <Icon className={`h-6 w-6 ${colors.text}`} />
            <span className={`text-3xl font-bold ${colors.text}`}>{verdictLabel}</span>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-6">
          {/* Confidence */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#64748B] uppercase tracking-wide">Confidence</span>
              <span className="text-3xl font-bold text-white">{result.confidence}%</span>
            </div>
            <div className="w-full h-3 bg-[#0D1117]/50 rounded-full overflow-hidden">
              <div
                className={`h-full ${colors.bg.replace('/10', '/50')} transition-all duration-1000 ease-out`}
                style={{ width: `${result.confidence}%` }}
              />
            </div>
          </div>

          {/* Risk Level */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#64748B] uppercase tracking-wide">Risk Level</span>
              <span className={`text-2xl font-semibold ${getRiskColor(result.risk)}`}>
                {result.risk}
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-2">
              Time Horizon: Long-term (1-2 years)
            </p>
          </div>
        </div>

        <Separator className="bg-[#64748B]/20" />

        {/* AI Verdict */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-2 uppercase tracking-wide">AI Verdict:</h4>
          <p className="text-[#64748B] leading-relaxed">
            {result.explanation}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// Future Outlook / Scenario Analysis Component
// ============================================================================

function FutureOutlookPanel() {
  return (
    <Card className="bg-[#0D1117]/60 border-[#64748B]/20 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <TrendingUp className="h-5 w-5 text-[#3B82F6]" />
          <CardTitle className="text-xl text-white">Future Outlook (Scenario Analysis)</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Disclaimer */}
        <div className="p-4 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-white mb-1">Important Disclaimer</p>
            <p className="text-xs text-[#64748B]">
              These are scenario-based projections, not guarantees. Actual results may vary significantly based on market conditions, company performance, and external events.
            </p>
          </div>
        </div>

        {/* Optimistic Scenario */}
        <div className="p-4 bg-[#10B981]/10 border border-[#10B981]/20 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-5 w-5 text-[#10B981]" />
            <h4 className="text-lg font-semibold text-white">Optimistic Scenario</h4>
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#10B981]">$220-$240</span>
              <span className="text-sm text-[#10B981]">(+17% to +28%)</span>
            </div>
            <div>
              <p className="text-xs text-[#64748B] mb-1">If these conditions occur:</p>
              <ul className="space-y-1">
                <li className="text-sm text-[#64748B] ml-4">• Strong iPhone sales exceed expectations</li>
                <li className="text-sm text-[#64748B] ml-4">• Margin expansion from services growth</li>
                <li className="text-sm text-[#64748B] ml-4">• Successful new product launches</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Neutral Scenario */}
        <div className="p-4 bg-[#64748B]/10 border border-[#64748B]/20 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="h-5 w-5 text-[#64748B]" />
            <h4 className="text-lg font-semibold text-white">Neutral Scenario</h4>
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">$185-$200</span>
              <span className="text-sm text-[#64748B]">(-1% to +7%)</span>
            </div>
            <div>
              <p className="text-xs text-[#64748B] mb-1">If these conditions occur:</p>
              <ul className="space-y-1">
                <li className="text-sm text-[#64748B] ml-4">• Market conditions remain stable</li>
                <li className="text-sm text-[#64748B] ml-4">• Earnings meet analyst expectations</li>
                <li className="text-sm text-[#64748B] ml-4">• No major product surprises</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Pessimistic Scenario */}
        <div className="p-4 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="h-5 w-5 text-[#EF4444]" />
            <h4 className="text-lg font-semibold text-white">Pessimistic Scenario</h4>
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#EF4444]">$150-$170</span>
              <span className="text-sm text-[#EF4444]">(-20% to -10%)</span>
            </div>
            <div>
              <p className="text-xs text-[#64748B] mb-1">If these conditions occur:</p>
              <ul className="space-y-1">
                <li className="text-sm text-[#64748B] ml-4">• Economic recession impacts consumer spending</li>
                <li className="text-sm text-[#64748B] ml-4">• Supply chain disruptions persist</li>
                <li className="text-sm text-[#64748B] ml-4">• Increased competition erodes market share</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center pt-4 border-t border-[#64748B]/10">
          <p className="text-xs text-[#64748B]">
            Timeframe: 12 months • Based on current market conditions and historical patterns
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// AI Chatbot Interface Component
// ============================================================================

interface ChatbotInterfaceProps {
  ticker: string
}

function ChatbotInterface({ ticker }: ChatbotInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const history = getChatHistory(ticker)
    setMessages(history)
  }, [ticker])

  const suggestedQuestions = [
    `What does the P/E ratio tell me about ${ticker}?`,
    `Is ${ticker} overvalued right now?`,
    `What are the main risks for ${ticker}?`,
    `Should I invest in ${ticker} for the long term?`
  ]

  const handleSend = async (question?: string) => {
    const messageText = question || input
    if (!messageText.trim() || loading) return

    const userMessage: ChatMessage = {
      role: 'user',
      message: messageText,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    saveChatMessage(ticker, userMessage)
    setInput('')
    setLoading(true)

    try {
      const result = await callAIAgent(
        `Stock: ${ticker}. Question: ${messageText}`,
        AGENT_IDS.chatbot
      )

      if (result.success && result.response?.result) {
        const aiMessage: ChatMessage = {
          role: 'ai',
          message: result.response.result.answer || 'Unable to generate response',
          timestamp: new Date().toISOString(),
          dataPoints: result.response.result.dataPoints || []
        }

        setMessages(prev => [...prev, aiMessage])
        saveChatMessage(ticker, aiMessage)
      } else {
        throw new Error('Failed to get chatbot response')
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: 'ai',
        message: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-[#0D1117]/60 border-[#64748B]/20 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Brain className="h-5 w-5 text-[#3B82F6]" />
          <CardTitle className="text-xl text-white">Ask the AI Analyst</CardTitle>
        </div>
        <p className="text-sm text-[#64748B] mt-2">
          Get instant answers with data citations and educational tips
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Chat History */}
        <ScrollArea className="h-96 rounded-lg border border-[#64748B]/20 bg-[#0D1117]/50 p-4">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12 text-[#64748B]">
                <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Ask me anything about {ticker}!</p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg p-4 ${
                    msg.role === 'user'
                      ? 'bg-[#3B82F6] text-white'
                      : 'bg-[#64748B]/20 text-[#64748B]'
                  }`}>
                    <p className="text-sm mb-1">{msg.message}</p>
                    <span className="text-xs opacity-70">{formatTime(msg.timestamp)}</span>

                    {msg.dataPoints && msg.dataPoints.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-white/20 space-y-1">
                        <p className="text-xs font-semibold">Data Citations:</p>
                        {msg.dataPoints.map((dp: DataPoint, idx: number) => (
                          <p key={idx} className="text-xs">
                            • {dp.metric}: {dp.value} ({dp.source})
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#64748B]/20 rounded-lg p-4">
                  <Loader2 className="h-5 w-5 text-[#3B82F6] animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Suggested Questions */}
        {messages.length === 0 && (
          <div className="space-y-2">
            <p className="text-xs text-[#64748B] uppercase tracking-wide">Suggested Questions:</p>
            <div className="space-y-2">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  className="w-full text-left px-4 py-2 rounded-lg bg-[#0D1117]/50 border border-[#64748B]/20 text-sm text-[#64748B] hover:border-[#3B82F6]/40 hover:text-[#3B82F6] transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Type your question..."
            className="flex-1 bg-[#0D1117]/80 border-[#64748B]/30 text-white"
            disabled={loading}
          />
          <Button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// Sector Analysis Component
// ============================================================================

interface SectorAnalysisProps {
  data: SectorTrendsResult | null
}

function SectorAnalysisPanel({ data }: SectorAnalysisProps) {
  if (!data) return null

  return (
    <Card className="bg-[#0D1117]/60 border-[#64748B]/20 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Activity className="h-5 w-5 text-[#3B82F6]" />
          <CardTitle className="text-xl text-white">Sector Analysis</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Sector Overview */}
        <div className="p-4 bg-[#3B82F6]/10 rounded-lg border border-[#3B82F6]/20">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-lg font-semibold text-white">{data.sector} Sector</h4>
            <Badge className="bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30">
              {data.sectorPerformance}
            </Badge>
          </div>
          <p className="text-sm text-[#64748B]">
            vs {data.sectorIndex}: <span className="text-white font-medium">{data.stockVsSector}</span>
          </p>
        </div>

        {/* Peer Comparison */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Peer Comparison:</h4>
          <div className="space-y-2">
            {data.peerComparison.map((peer, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-[#0D1117]/50 rounded-lg border border-[#64748B]/10">
                <div>
                  <span className="text-white font-medium">{peer.ticker}</span>
                  <span className="text-sm text-[#64748B] ml-2">{peer.name}</span>
                </div>
                <span className={`text-sm font-medium ${
                  peer.relativePerformance.startsWith('+') ? 'text-[#10B981]' : 'text-[#EF4444]'
                }`}>
                  {peer.relativePerformance}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Industry Trends */}
        {data.industryTrends.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Industry Trends:</h4>
            <ul className="space-y-2">
              {data.industryTrends.map((trend, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#64748B]">
                  <span className="text-[#3B82F6] mt-1">•</span>
                  <span>{trend}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Rotation Signal */}
        <div className="p-4 bg-[#0D1117]/50 rounded-lg border border-[#64748B]/10">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#64748B]">Rotation Signal</span>
            <span className="text-white font-semibold">{data.rotationSignal}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// Analysis Panels (Technical, Fundamental, News)
// ============================================================================

interface AnalysisPanelProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  defaultExpanded?: boolean
}

function AnalysisPanel({ title, icon, children, defaultExpanded = true }: AnalysisPanelProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

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

// Technical Analysis Display (simplified - using existing logic)
function TechnicalAnalysisDisplay({ data, summary }: { data: TechnicalAnalysisResult; summary: string }) {
  return (
    <div className="space-y-4">
      <p className="text-[#64748B] leading-relaxed">{summary}</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-[#0D1117]/50 rounded-lg border border-[#64748B]/10">
          <div className="text-sm text-[#64748B] mb-1">RSI</div>
          <div className="text-2xl font-semibold text-white">{data.rsi.toFixed(1)}</div>
          <div className="text-xs text-[#3B82F6] mt-1">{data.rsiSignal}</div>
        </div>
        <div className="p-4 bg-[#0D1117]/50 rounded-lg border border-[#64748B]/10">
          <div className="text-sm text-[#64748B] mb-1">MACD</div>
          <div className="text-2xl font-semibold text-white">{data.macd}</div>
          <div className="text-xs text-[#3B82F6] mt-1">{data.macdDate}</div>
        </div>
      </div>
    </div>
  )
}

// Fundamental Analysis Display (simplified)
function FundamentalAnalysisDisplay({ data, summary }: { data: FundamentalAnalysisResult; summary: string }) {
  return (
    <div className="space-y-4">
      <p className="text-[#64748B] leading-relaxed">{summary}</p>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-[#0D1117]/50 rounded-lg border border-[#64748B]/10">
          <div className="text-sm text-[#64748B] mb-1">P/E Ratio</div>
          <div className="text-2xl font-semibold text-white">{data.peRatio.toFixed(1)}</div>
        </div>
        <div className="p-4 bg-[#0D1117]/50 rounded-lg border border-[#64748B]/10">
          <div className="text-sm text-[#64748B] mb-1">Debt/Equity</div>
          <div className="text-2xl font-semibold text-white">{data.debtToEquity.toFixed(2)}</div>
        </div>
        <div className="p-4 bg-[#0D1117]/50 rounded-lg border border-[#64748B]/10">
          <div className="text-sm text-[#64748B] mb-1">Health Score</div>
          <div className="text-2xl font-semibold text-white">{data.healthScore}/100</div>
        </div>
      </div>

      {data.strengths.length > 0 && (
        <div className="p-4 bg-[#10B981]/10 rounded-lg border border-[#10B981]/20">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
            <span className="text-sm font-medium text-white">Strengths</span>
          </div>
          <ul className="space-y-1">
            {data.strengths.map((s, i) => (
              <li key={i} className="text-sm text-[#64748B] ml-6">• {s}</li>
            ))}
          </ul>
        </div>
      )}

      {data.concerns.length > 0 && (
        <div className="p-4 bg-[#EF4444]/10 rounded-lg border border-[#EF4444]/20">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-[#EF4444]" />
            <span className="text-sm font-medium text-white">Concerns</span>
          </div>
          <ul className="space-y-1">
            {data.concerns.map((c, i) => (
              <li key={i} className="text-sm text-[#64748B] ml-6">• {c}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// News Sentiment Display (simplified)
function NewsSentimentDisplay({ data, summary }: { data: NewsSentimentResult; summary: string }) {
  return (
    <div className="space-y-4">
      <p className="text-[#64748B] leading-relaxed">{summary}</p>

      <div className="p-4 bg-[#0D1117]/50 rounded-lg border border-[#64748B]/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-[#64748B]">Sentiment Score</span>
          <span className="text-2xl font-bold text-white">{data.sentimentScore}/100</span>
        </div>
        <div className="text-sm text-[#3B82F6]">{data.overallSentiment} • {data.sentimentTrend}</div>
      </div>

      {data.articles.slice(0, 3).map((article, i) => (
        <div key={i} className="p-4 bg-[#0D1117]/50 rounded-lg border border-[#64748B]/10">
          <h4 className="text-white font-medium mb-2">{article.title}</h4>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#64748B]">{article.source} • {article.date}</span>
            <Badge className={
              article.sentiment === 'positive' ? 'bg-[#10B981]/10 text-[#10B981]' :
              article.sentiment === 'negative' ? 'bg-[#EF4444]/10 text-[#EF4444]' :
              'bg-[#64748B]/10 text-[#64748B]'
            }>
              {article.sentiment}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// Main Stock Detail Component
// ============================================================================

export default function StockDetailPage({ params }: { params: { ticker: string } }) {
  const ticker = params.ticker.toUpperCase()
  const stockInfo = STOCK_DATA[ticker] || {
    name: `${ticker} Inc.`,
    price: 150.00,
    change: 2.50,
    changePercent: 1.69,
    sector: 'Technology'
  }

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analysisResult, setAnalysisResult] = useState<StockAnalysisResult | null>(null)
  const [technicalData, setTechnicalData] = useState<TechnicalAnalysisResult | null>(null)
  const [fundamentalData, setFundamentalData] = useState<FundamentalAnalysisResult | null>(null)
  const [sentimentData, setSentimentData] = useState<NewsSentimentResult | null>(null)
  const [sectorData, setSectorData] = useState<SectorTrendsResult | null>(null)
  const [inWatchlist, setInWatchlist] = useState(false)

  useEffect(() => {
    setInWatchlist(isInWatchlist(ticker))
    analyzeStock()
  }, [ticker])

  const analyzeStock = async () => {
    setLoading(true)
    setError(null)

    try {
      // Call all agents in parallel
      const [coordResult, techResult, fundResult, sentResult, sectorResult] = await Promise.all([
        callAIAgent(`Analyze ${ticker} stock. Current price: $${stockInfo.price.toFixed(2)}`, AGENT_IDS.coordinator),
        callAIAgent(`Provide technical analysis for ${ticker}`, AGENT_IDS.technical),
        callAIAgent(`Provide fundamental analysis for ${ticker}`, AGENT_IDS.fundamental),
        callAIAgent(`Provide news sentiment analysis for ${ticker}`, AGENT_IDS.sentiment),
        callAIAgent(`Analyze sector trends for ${ticker} in ${stockInfo.sector} sector`, AGENT_IDS.sectorTrends)
      ])

      if (coordResult.success && coordResult.response?.result) {
        setAnalysisResult(coordResult.response.result as StockAnalysisResult)
      }
      if (techResult.success && techResult.response?.result) {
        setTechnicalData(techResult.response.result as TechnicalAnalysisResult)
      }
      if (fundResult.success && fundResult.response?.result) {
        setFundamentalData(fundResult.response.result as FundamentalAnalysisResult)
      }
      if (sentResult.success && sentResult.response?.result) {
        setSentimentData(sentResult.response.result as NewsSentimentResult)
      }
      if (sectorResult.success && sectorResult.response?.result) {
        setSectorData(sectorResult.response.result as SectorTrendsResult)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const toggleWatchlist = () => {
    if (inWatchlist) {
      removeFromWatchlist(ticker)
    } else {
      addToWatchlist({
        ticker,
        companyName: stockInfo.name,
        addedAt: new Date().toISOString(),
        lastPrice: stockInfo.price,
        lastVerdict: analysisResult?.verdict
      })
    }
    setInWatchlist(!inWatchlist)
  }

  const exportAnalysis = () => {
    const summary = `
StockAI Analysis Report - ${ticker}
Generated: ${new Date().toLocaleString()}

Company: ${stockInfo.name}
Price: $${stockInfo.price.toFixed(2)}
Change: ${stockInfo.change >= 0 ? '+' : ''}${stockInfo.change.toFixed(2)} (${stockInfo.change >= 0 ? '+' : ''}${stockInfo.changePercent.toFixed(2)}%)

VERDICT: ${analysisResult?.verdict || 'N/A'}
Confidence: ${analysisResult?.confidence || 0}%
Risk: ${analysisResult?.risk || 'N/A'}

EXPLANATION:
${analysisResult?.explanation || 'N/A'}

---
This report is for informational purposes only and not financial advice.
    `.trim()

    const blob = new Blob([summary], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `StockAI-${ticker}-Analysis.txt`
    a.click()
    URL.revokeObjectURL(url)
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

            <div className="flex items-center gap-4">
              <Link href="/learn">
                <Button variant="outline" className="border-[#64748B]/30 text-white hover:bg-[#64748B]/10">
                  Learning Hub
                </Button>
              </Link>
              <Link href="/watchlist">
                <Button variant="outline" className="border-[#64748B]/30 text-white hover:bg-[#64748B]/10">
                  Watchlist
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="border-[#64748B]/30 text-white hover:bg-[#64748B]/10">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
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
                  <p className="text-lg text-white font-medium">Analyzing {ticker}...</p>
                  <p className="text-sm text-[#64748B]">Gathering technical, fundamental, sentiment, and sector data</p>
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

        {/* Executive Summary */}
        {analysisResult && !loading && (
          <ExecutiveSummaryCard result={analysisResult} ticker={ticker} stockInfo={stockInfo} />
        )}

        {/* Action Buttons */}
        {analysisResult && !loading && (
          <div className="flex gap-4 justify-center">
            <Button
              onClick={toggleWatchlist}
              variant="outline"
              className={`border-[#64748B]/30 ${inWatchlist ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30' : 'text-white'} hover:bg-[#64748B]/10`}
            >
              {inWatchlist ? (
                <>
                  <BookmarkCheck className="h-4 w-4 mr-2" />
                  In Watchlist
                </>
              ) : (
                <>
                  <Bookmark className="h-4 w-4 mr-2" />
                  Add to Watchlist
                </>
              )}
            </Button>

            <Button
              onClick={exportAnalysis}
              variant="outline"
              className="border-[#64748B]/30 text-white hover:bg-[#64748B]/10"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Summary
            </Button>

            <Button
              onClick={analyzeStock}
              className="bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white"
            >
              <Activity className="h-4 w-4 mr-2" />
              Re-analyze
            </Button>
          </div>
        )}

        {/* Future Outlook */}
        {!loading && <FutureOutlookPanel />}

        {/* Two Column Layout: Analysis Panels + Chatbot */}
        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Analysis Panels */}
            <div className="lg:col-span-2 space-y-6">
              {/* Sector Analysis */}
              {sectorData && (
                <SectorAnalysisPanel data={sectorData} />
              )}

              {/* Technical Analysis */}
              {technicalData && analysisResult && (
                <AnalysisPanel title="Technical Analysis" icon={<BarChart3 className="h-5 w-5" />}>
                  <TechnicalAnalysisDisplay data={technicalData} summary={analysisResult.technicalSummary} />
                </AnalysisPanel>
              )}

              {/* Fundamental Analysis */}
              {fundamentalData && analysisResult && (
                <AnalysisPanel title="Fundamental Analysis" icon={<TrendingUp className="h-5 w-5" />}>
                  <FundamentalAnalysisDisplay data={fundamentalData} summary={analysisResult.fundamentalSummary} />
                </AnalysisPanel>
              )}

              {/* News Sentiment */}
              {sentimentData && analysisResult && (
                <AnalysisPanel title="News Sentiment Analysis" icon={<Newspaper className="h-5 w-5" />}>
                  <NewsSentimentDisplay data={sentimentData} summary={analysisResult.sentimentSummary} />
                </AnalysisPanel>
              )}
            </div>

            {/* Right Column: Chatbot */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <ChatbotInterface ticker={ticker} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-[#64748B]/20 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[#64748B] text-sm">
            Analysis for {ticker} • Not financial advice • For educational purposes only
          </p>
        </div>
      </footer>
    </div>
  )
}
