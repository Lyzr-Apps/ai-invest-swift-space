/**
 * Watchlist and LocalStorage Helper Functions
 */

import { WatchlistItem, ChatMessage } from './types'

// ============================================================================
// Watchlist Functions
// ============================================================================

const WATCHLIST_KEY = 'stockai_watchlist'

export function getWatchlist(): WatchlistItem[] {
  if (typeof window === 'undefined') return []

  try {
    const stored = localStorage.getItem(WATCHLIST_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function addToWatchlist(item: WatchlistItem): void {
  if (typeof window === 'undefined') return

  const watchlist = getWatchlist()
  const exists = watchlist.find(w => w.ticker === item.ticker)

  if (!exists) {
    watchlist.push({
      ...item,
      addedAt: new Date().toISOString()
    })
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist))
  }
}

export function removeFromWatchlist(ticker: string): void {
  if (typeof window === 'undefined') return

  const watchlist = getWatchlist()
  const filtered = watchlist.filter(w => w.ticker !== ticker)
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(filtered))
}

export function isInWatchlist(ticker: string): boolean {
  const watchlist = getWatchlist()
  return watchlist.some(w => w.ticker === ticker)
}

export function updateWatchlistItem(ticker: string, updates: Partial<WatchlistItem>): void {
  if (typeof window === 'undefined') return

  const watchlist = getWatchlist()
  const index = watchlist.findIndex(w => w.ticker === ticker)

  if (index !== -1) {
    watchlist[index] = {
      ...watchlist[index],
      ...updates,
      lastUpdated: new Date().toISOString()
    }
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist))
  }
}

// ============================================================================
// Learning Progress Functions
// ============================================================================

const LEARNING_PROGRESS_KEY = 'stockai_learning_progress'

export function getLearningProgress(): Record<string, boolean> {
  if (typeof window === 'undefined') return {}

  try {
    const stored = localStorage.getItem(LEARNING_PROGRESS_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

export function markLessonComplete(lessonId: string): void {
  if (typeof window === 'undefined') return

  const progress = getLearningProgress()
  progress[lessonId] = true
  localStorage.setItem(LEARNING_PROGRESS_KEY, JSON.stringify(progress))
}

export function isLessonComplete(lessonId: string): boolean {
  const progress = getLearningProgress()
  return progress[lessonId] === true
}

export function getCompletedLessonsCount(): number {
  const progress = getLearningProgress()
  return Object.values(progress).filter(v => v === true).length
}

// ============================================================================
// Chat History Functions
// ============================================================================

export function getChatHistory(ticker: string): ChatMessage[] {
  if (typeof window === 'undefined') return []

  const key = `stockai_chat_${ticker}`
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function saveChatMessage(ticker: string, message: ChatMessage): void {
  if (typeof window === 'undefined') return

  const key = `stockai_chat_${ticker}`
  const history = getChatHistory(ticker)

  // Keep only last 20 messages to avoid storage limits
  const updatedHistory = [...history, message].slice(-20)

  localStorage.setItem(key, JSON.stringify(updatedHistory))
}

export function clearChatHistory(ticker: string): void {
  if (typeof window === 'undefined') return

  const key = `stockai_chat_${ticker}`
  localStorage.removeItem(key)
}

// ============================================================================
// General Helpers
// ============================================================================

export function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  } catch {
    return isoString
  }
}

export function formatTime(isoString: string): string {
  try {
    const date = new Date(isoString)
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    })
  } catch {
    return isoString
  }
}
