import { useState } from 'react'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { saveAIFeedback } from '../services/aiFeedback'

interface Evidence {
  label: string
  value: string
  mono?: boolean
  delta?: string
  deltaColor?: 'red' | 'amber' | 'green'
}

interface AIInsightCardProps {
  insightType?: string
  evidence: Evidence[]
  insight: string | null
  isLoading: boolean
  error: boolean
  headline?: string | null
  keyTakeaway?: string | null
  confidence?: 'high' | 'medium' | 'low' | null
  priority?: 'high' | 'medium' | 'low' | null
}

function AIInsightCard({
  insightType = 'unknown',
  evidence,
  insight,
  isLoading,
  error,
  headline,
  keyTakeaway,
  confidence,
  priority,
}: AIInsightCardProps) {
  const [feedback, setFeedback] = useState<'helpful' | 'not_helpful' | null>(null)

  const handleFeedback = (rating: 'helpful' | 'not_helpful') => {
    setFeedback(rating)
    saveAIFeedback({
      insightType,
      timestamp: new Date().toISOString(),
      rating,
    })
  }

  if (!isLoading && !error && !insight) return null

  const deltaColorCls = (c?: 'red' | 'amber' | 'green') =>
    c === 'red'   ? 'text-danger'
    : c === 'amber' ? 'text-warning'
    : c === 'green' ? 'text-success'
    : 'text-secondary'

  return (
    <div className="mt-4" aria-live="polite" aria-atomic="true">

      {/* Evidence panel */}
      {evidence.length > 0 && (
        <div className="mb-5 rounded-lg bg-gray-50 p-4">
          <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:[grid-template-columns:repeat(3,minmax(0,220px))]">
            {evidence.map((item) => (
              <div key={item.label}>
                <p className="mb-1 text-[12px] text-secondary">{item.label}</p>
                <p className={`text-[28px] font-bold leading-none text-gray-900 ${item.mono !== false ? 'tabular-nums' : ''}`}>
                  {item.value}
                </p>
                {item.delta && (
                  <p className={`mt-0.5 tabular-nums text-[11px] ${deltaColorCls(item.deltaColor)}`}>
                    {item.delta}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && (
        <div className="animate-pulse space-y-3">
          <div className="h-3.5 w-3/5 rounded-lg bg-gray-200" />
          <div className="h-3 w-full rounded-lg bg-gray-200/80" />
          <div className="h-3 w-[88%] rounded-lg bg-gray-200/80" />
          <div className="h-3 w-[74%] rounded-lg bg-gray-200/80" />
          <div className="h-3 w-[82%] rounded-lg bg-gray-200/80" />
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className="rounded-lg bg-gray-50 px-4 py-3" role="alert">
          <p className="text-[14px] text-secondary">
            AI insights temporarily unavailable. Your data is safe.
          </p>
        </div>
      )}

      {/* Insight content */}
      {!isLoading && !error && insight && (
        <div>
          {headline && (
            <h3 className="mb-2 text-[15px] font-semibold leading-snug text-gray-900">
              {headline}
            </h3>
          )}

          <p className="max-w-[640px] text-[14px] leading-relaxed text-secondary">
            {insight}
          </p>

          {keyTakeaway && (
            <div className="mt-4 rounded-lg bg-accent-soft px-4 py-3">
              <p className="mb-1.5 text-[12px] font-semibold text-accent">
                Key takeaway
              </p>
              <p className="text-[14px] leading-relaxed text-gray-900">
                {keyTakeaway}
              </p>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between border-t border-black/5 pt-4">
            <div className="flex items-center gap-4">
              {confidence && (
                <span className="tabular-nums text-[13px] text-secondary">
                  Confidence: {confidence}
                </span>
              )}
              {priority && (
                <span className="tabular-nums text-[13px] text-secondary">
                  Priority: {priority}
                </span>
              )}
              {!confidence && !priority && (
                <span className="text-[13px] text-secondary">Was this helpful?</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleFeedback('helpful')}
                title="Helpful"
                aria-pressed={feedback === 'helpful'}
                disabled={feedback !== null}
                className={`flex h-11 w-11 items-center justify-center rounded-lg transition-all duration-150 ease-out active:scale-[0.98] disabled:cursor-not-allowed sm:h-8 sm:w-8 ${
                  feedback === 'helpful'
                    ? 'bg-accent-soft text-accent'
                    : feedback !== null
                      ? 'bg-gray-100 text-secondary opacity-50'
                      : 'bg-gray-100 text-secondary hover:bg-gray-200'
                }`}
              >
                <ThumbsUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleFeedback('not_helpful')}
                title="Not helpful"
                aria-pressed={feedback === 'not_helpful'}
                disabled={feedback !== null}
                className={`flex h-11 w-11 items-center justify-center rounded-lg transition-all duration-150 ease-out active:scale-[0.98] disabled:cursor-not-allowed sm:h-8 sm:w-8 ${
                  feedback === 'not_helpful'
                    ? 'bg-danger/10 text-danger'
                    : feedback !== null
                      ? 'bg-gray-100 text-secondary opacity-50'
                      : 'bg-gray-100 text-secondary hover:bg-gray-200'
                }`}
              >
                <ThumbsDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default AIInsightCard
