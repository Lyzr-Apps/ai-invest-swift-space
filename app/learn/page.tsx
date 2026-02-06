'use client'

/**
 * StockAI Learning Hub
 * Structured educational content for students and professionals
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  TrendingUp,
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { learningTracks } from '@/lib/learningContent'
import { getLearningProgress, markLessonComplete, isLessonComplete, getCompletedLessonsCount } from '@/lib/watchlistHelpers'
import type { Lesson } from '@/lib/types'

// ============================================================================
// Lesson Card Component
// ============================================================================

interface LessonCardProps {
  lesson: Lesson
  isComplete: boolean
  onComplete: (lessonId: string) => void
}

function LessonCard({ lesson, isComplete, onComplete }: LessonCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getDifficultyColor = (difficulty: string) => {
    if (difficulty === 'Beginner') return 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30'
    if (difficulty === 'Intermediate') return 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30'
    return 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30'
  }

  return (
    <Card className={`${isComplete ? 'bg-[#10B981]/5 border-[#10B981]/20' : 'bg-[#0D1117]/60 border-[#64748B]/20'} hover:border-[#3B82F6]/40 transition-all duration-300`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-semibold text-white">{lesson.title}</h3>
              {isComplete && (
                <CheckCircle2 className="h-5 w-5 text-[#10B981] flex-shrink-0" />
              )}
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <Badge className={getDifficultyColor(lesson.difficulty)}>
                {lesson.difficulty}
              </Badge>
              <div className="flex items-center gap-1 text-sm text-[#64748B]">
                <Clock className="h-4 w-4" />
                <span>{lesson.duration}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg hover:bg-[#3B82F6]/10 text-[#64748B] hover:text-[#3B82F6] transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6 animate-in slide-in-from-top-2 duration-300">
          {/* Lesson Content */}
          <div className="prose prose-invert max-w-none">
            <div className="text-[#64748B] leading-relaxed whitespace-pre-wrap">
              {lesson.content}
            </div>
          </div>

          {/* Key Points */}
          {lesson.keyPoints && lesson.keyPoints.length > 0 && (
            <div className="p-4 bg-[#3B82F6]/10 rounded-lg border border-[#3B82F6]/20">
              <h4 className="text-sm font-semibold text-white mb-3">Key Takeaways:</h4>
              <ul className="space-y-2">
                {lesson.keyPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#64748B]">
                    <span className="text-[#3B82F6] mt-1">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Formula Examples */}
          {lesson.formulaExamples && lesson.formulaExamples.length > 0 && (
            <div className="p-4 bg-[#0D1117]/80 rounded-lg border border-[#64748B]/20">
              <h4 className="text-sm font-semibold text-white mb-3">Formulas:</h4>
              <ul className="space-y-2">
                {lesson.formulaExamples.map((formula, i) => (
                  <li key={i} className="text-sm text-[#F59E0B] font-mono">
                    {formula}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Interactive Example */}
          {lesson.interactiveExample && (
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href={`/stock/${lesson.interactiveExample}`} className="flex-1">
                <Button
                  variant="outline"
                  className="w-full border-[#3B82F6]/30 text-[#3B82F6] hover:bg-[#3B82F6]/10"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Apply to {lesson.interactiveExample} Stock
                </Button>
              </Link>

              {!isComplete && (
                <Button
                  onClick={() => onComplete(lesson.id)}
                  className="bg-[#10B981] hover:bg-[#10B981]/90 text-white"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Mark Complete
                </Button>
              )}
            </div>
          )}

          {/* Related Stocks */}
          {lesson.relatedStocks && lesson.relatedStocks.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Practice with these stocks:</h4>
              <div className="flex flex-wrap gap-2">
                {lesson.relatedStocks.map((ticker) => (
                  <Link key={ticker} href={`/stock/${ticker}`}>
                    <Badge className="bg-[#0D1117] border-[#3B82F6]/30 text-[#3B82F6] hover:bg-[#3B82F6]/10 cursor-pointer">
                      {ticker}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}

// ============================================================================
// Main Learning Hub Component
// ============================================================================

export default function LearningHub() {
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({})
  const [activeTrack, setActiveTrack] = useState<string>('beginner')

  useEffect(() => {
    setCompletedLessons(getLearningProgress())
  }, [])

  const handleCompleteLesson = (lessonId: string) => {
    markLessonComplete(lessonId)
    setCompletedLessons(prev => ({
      ...prev,
      [lessonId]: true
    }))
  }

  const calculateProgress = (trackKey: string) => {
    const track = learningTracks[trackKey]
    if (!track) return 0

    const completed = track.lessons.filter(lesson => completedLessons[lesson.id]).length
    return (completed / track.lessons.length) * 100
  }

  const totalLessons = Object.values(learningTracks).reduce((sum, track) => sum + track.lessons.length, 0)
  const totalCompleted = getCompletedLessonsCount()
  const overallProgress = totalLessons > 0 ? (totalCompleted / totalLessons) * 100 : 0

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
                className="text-[#3B82F6] font-medium"
              >
                Learning Hub
              </Link>
              <Link
                href="/watchlist"
                className="text-[#64748B] hover:text-[#3B82F6] transition-colors font-medium"
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
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="flex items-center justify-center gap-3">
            <BookOpen className="h-12 w-12 text-[#3B82F6]" />
          </div>

          <h2 className="text-5xl font-bold text-white">
            Learning Hub
          </h2>

          <p className="text-xl text-[#64748B] max-w-2xl mx-auto">
            Master stock investing from basics to advanced strategies.
            Interactive lessons with real market examples.
          </p>

          {/* Overall Progress */}
          <Card className="bg-[#0D1117]/60 border-[#64748B]/20 max-w-md mx-auto">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#64748B]">Overall Progress</span>
                  <span className="text-sm font-semibold text-white">
                    {totalCompleted} / {totalLessons} Lessons
                  </span>
                </div>
                <Progress value={overallProgress} className="h-2" />
                <p className="text-xs text-[#64748B] text-center">
                  {overallProgress.toFixed(0)}% Complete
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Learning Tracks */}
      <section className="container mx-auto px-4 py-8">
        <Tabs value={activeTrack} onValueChange={setActiveTrack} className="space-y-8">
          <TabsList className="grid grid-cols-3 w-full max-w-2xl mx-auto bg-[#0D1117]/60 border border-[#64748B]/20">
            <TabsTrigger value="beginner" className="data-[state=active]:bg-[#3B82F6] data-[state=active]:text-white">
              Beginner
            </TabsTrigger>
            <TabsTrigger value="intermediate" className="data-[state=active]:bg-[#3B82F6] data-[state=active]:text-white">
              Intermediate
            </TabsTrigger>
            <TabsTrigger value="advanced" className="data-[state=active]:bg-[#3B82F6] data-[state=active]:text-white">
              Advanced
            </TabsTrigger>
          </TabsList>

          {Object.entries(learningTracks).map(([trackKey, track]) => (
            <TabsContent key={trackKey} value={trackKey} className="space-y-6">
              {/* Track Header */}
              <Card className="bg-gradient-to-r from-[#3B82F6]/10 to-[#0D1117]/60 border-[#3B82F6]/30">
                <CardContent className="p-8">
                  <h3 className="text-3xl font-bold text-white mb-3">{track.name}</h3>
                  <p className="text-lg text-[#64748B] mb-6">{track.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#64748B]">Track Progress</span>
                      <span className="text-white font-medium">
                        {track.lessons.filter(l => completedLessons[l.id]).length} / {track.lessons.length} Lessons
                      </span>
                    </div>
                    <Progress value={calculateProgress(trackKey)} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Lessons */}
              <div className="space-y-4">
                {track.lessons.map((lesson) => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    isComplete={completedLessons[lesson.id] || false}
                    onComplete={handleCompleteLesson}
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-r from-[#3B82F6]/20 to-[#0D1117]/60 border-[#3B82F6]/40 max-w-3xl mx-auto">
          <CardContent className="p-12 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Apply What You've Learned?
            </h3>
            <p className="text-lg text-[#64748B] mb-8">
              Practice with real stock analysis and see concepts in action
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/stock/AAPL">
                <Button
                  size="lg"
                  className="px-8 py-6 text-lg bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white"
                >
                  Analyze Apple Stock
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link href="/">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-lg border-[#64748B]/30 text-white hover:bg-[#64748B]/10"
                >
                  Explore More Stocks
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#64748B]/20 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[#64748B] text-sm">
            Learning Hub - Build your investing knowledge with interactive lessons
          </p>
        </div>
      </footer>
    </div>
  )
}
