/**
 * StockAI Type Definitions
 * Based on actual agent response schemas
 */

// ============================================================================
// Technical Analysis Types
// ============================================================================

export interface TechnicalAnalysisResult {
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

// ============================================================================
// Fundamental Analysis Types
// ============================================================================

export interface FundamentalAnalysisResult {
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

// ============================================================================
// News Sentiment Types
// ============================================================================

export interface NewsArticle {
  title: string
  source: string
  date: string
  sentiment: string
  impact: string
}

export interface NewsSentimentResult {
  overallSentiment: string
  sentimentScore: number
  articleCount: number
  articles: NewsArticle[]
  keyEvents: string[]
  sentimentTrend: string
}

// ============================================================================
// Sector Analysis Types (NEW)
// ============================================================================

export interface PeerComparison {
  ticker: string
  name: string
  relativePerformance: string
}

export interface SectorTrendsResult {
  sector: string
  sectorPerformance: string
  sectorIndex: string
  stockVsSector: string
  peerComparison: PeerComparison[]
  sectorHealth: string
  industryTrends: string[]
  rotationSignal: string
  sectorRisk: string
}

// ============================================================================
// AI Chatbot Types (NEW)
// ============================================================================

export interface DataPoint {
  metric: string
  value: string
  source: string
  timestamp: string
}

export interface ChatbotResponse {
  answer: string
  dataPoints: DataPoint[]
  relatedConcepts: string[]
  confidenceLevel: string
  educationalTips: string[]
}

// ============================================================================
// Stock Analysis Coordinator Types
// ============================================================================

export interface StockAnalysisResult {
  verdict: string
  confidence: number
  risk: string
  technicalSummary: string
  fundamentalSummary: string
  sentimentSummary: string
  explanation: string
}

// ============================================================================
// Stock Data Types
// ============================================================================

export interface StockData {
  ticker: string
  name: string
  price: number
  change: number
  changePercent: number
  sector?: string
}

// ============================================================================
// Scenario Analysis Types (NEW)
// ============================================================================

export interface ScenarioOutlook {
  optimistic: {
    priceRange: string
    percentChange: string
    conditions: string[]
  }
  neutral: {
    priceRange: string
    percentChange: string
    conditions: string[]
  }
  pessimistic: {
    priceRange: string
    percentChange: string
    conditions: string[]
  }
  timeframe: string
}

// ============================================================================
// Watchlist Types (NEW)
// ============================================================================

export interface WatchlistItem {
  ticker: string
  companyName: string
  addedAt: string
  lastPrice?: number
  lastVerdict?: string
  lastUpdated?: string
}

// ============================================================================
// Chat Message Types (NEW)
// ============================================================================

export interface ChatMessage {
  role: 'user' | 'ai'
  message: string
  timestamp: string
  dataPoints?: DataPoint[]
}

// ============================================================================
// Learning Hub Types (NEW)
// ============================================================================

export interface Lesson {
  id: string
  title: string
  duration: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  content: string
  keyPoints: string[]
  interactiveExample?: string
  relatedStocks?: string[]
  formulaExamples?: string[]
}

export interface LearningTrack {
  name: string
  description: string
  lessons: Lesson[]
}

// ============================================================================
// Agent IDs
// ============================================================================

export const AGENT_IDS = {
  coordinator: '6985a0d88ce1fc653cfdee14',
  technical: '6985a0a3094c8b2d4207dd88',
  fundamental: '6985a0b2301c62c7ca2c7d76',
  sentiment: '6985a0c3e17e33c11eed1b22',
  sectorTrends: '6985a65fb37fff3a03c07c9e',
  chatbot: '6985a64ae2c0086a4fc43bf5'
} as const
