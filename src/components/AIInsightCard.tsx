import { useState } from 'react'
import { saveAIFeedback } from '../services/aiFeedback'

interface Evidence {
  label: string
  value: string
  mono?: boolean                           // default true — set false for text values
  delta?: string                           // e.g. "↓ declining", "↑ improving"
  deltaColor?: 'red' | 'amber' | 'green'  // drives threshold colour
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
    // Save feedback to localStorage so we can track prompt quality over time
    saveAIFeedback({
      insightType,
      timestamp: new Date().toISOString(),
      rating,
    })
  }

  // Nothing to render until the user has triggered generation
  if (!isLoading && !error && !insight) return null

  const deltaColorCls = (c?: 'red' | 'amber' | 'green') =>
    c === 'red'   ? 'text-red-500'
    : c === 'amber' ? 'text-amber-500'
    : c === 'green' ? 'text-green-600'
    : 'text-tertiary'

  return (
    <div className="mt-4">

      {/* ── Evidence mini-stat cards ───────────────────────────────── */}
      {evidence.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-3">
          {evidence.map((item) => (
            <div
              key={item.label}
              className="rounded-[8px] border border-black/[0.07] bg-zinc-50 px-4 py-3"
            >
              <p className={`text-[16px] font-medium leading-none text-zinc-900 ${item.mono !== false ? 'font-mono tabular-nums' : ''}`}>
                {item.value}
              </p>
              <p className="mt-1 text-[11px] text-tertiary">{item.label}</p>
              {item.delta && (
                <p className={`mt-0.5 font-mono text-[11px] tabular-nums ${deltaColorCls(item.deltaColor)}`}>
                  {item.delta}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Loading skeleton ───────────────────────────────────────── */}
      {isLoading && (
        <div className="animate-pulse space-y-2.5">
          <div className="h-[13px] w-3/5 rounded-full bg-zinc-200" />
          <div className="h-2.5 w-full rounded-full bg-zinc-100" />
          <div className="h-2.5 w-[88%] rounded-full bg-zinc-100" />
          <div className="h-2.5 w-[74%] rounded-full bg-zinc-100" />
          <div className="h-2.5 w-[82%] rounded-full bg-zinc-100" />
        </div>
      )}

      {/* ── Error state ────────────────────────────────────────────── */}
      {error && !isLoading && (
        <div className="rounded-[8px] border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-[13px] text-amber-700">
            AI insights temporarily unavailable. Your data is safe.
          </p>
        </div>
      )}

      {/* ── Insight content ────────────────────────────────────────── */}
      {!isLoading && !error && insight && (
        <div>
          {headline && (
            <h3 className="mb-2 text-[14.5px] font-semibold leading-snug text-zinc-900">
              {headline}
            </h3>
          )}

          <p className="max-w-[640px] text-[13px] leading-[1.65] text-secondary">
            {insight}
          </p>

          {/* Key takeaway block */}
          {keyTakeaway && (
            <div className="mt-4 rounded-[8px] border-l-2 border-accent bg-accent-soft px-4 py-3">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-accent">
                Key takeaway
              </p>
              <p className="text-[13px] leading-relaxed text-zinc-800">
                {keyTakeaway}
              </p>
            </div>
          )}

          {/* Footer: meta left, feedback buttons right */}
          <div className="mt-4 flex items-center justify-between border-t border-black/[0.07] pt-3">
            <div className="flex items-center gap-4">
              {confidence && (
                <span className="font-mono text-[12px] tabular-nums text-tertiary">
                  Confidence: {confidence}
                </span>
              )}
              {priority && (
                <span className="font-mono text-[12px] tabular-nums text-tertiary">
                  Priority: {priority}
                </span>
              )}
              {!confidence && !priority && (
                <span className="font-mono text-[12px] text-tertiary">
                  Was this helpful?
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Thumbs up */}
              <button
                onClick={() => handleFeedback('helpful')}
                title="Helpful"
                className={`flex h-[30px] w-[30px] items-center justify-center rounded-[6px] border transition-all duration-150 ${
                  feedback === 'helpful'
                    ? 'border-accent bg-accent-soft text-accent'
                    : 'border-black/[0.12] bg-white text-tertiary hover:border-black/[0.2] hover:text-zinc-700'
                }`}
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                </svg>
              </button>

              {/* Thumbs down */}
              <button
                onClick={() => handleFeedback('not_helpful')}
                title="Not helpful"
                className={`flex h-[30px] w-[30px] items-center justify-center rounded-[6px] border transition-all duration-150 ${
                  feedback === 'not_helpful'
                    ? 'border-red-300 bg-red-50 text-red-500'
                    : 'border-black/[0.12] bg-white text-tertiary hover:border-black/[0.2] hover:text-zinc-700'
                }`}
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.861-2.4c.498-.634 1.226-1.08 2.032-1.08h.384" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default AIInsightCard
