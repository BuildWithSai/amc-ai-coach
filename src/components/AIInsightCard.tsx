import { useState } from 'react'
import { saveAIFeedback } from '../services/aiFeedback'

interface Evidence {
  label: string
  value: string
}

interface AIInsightCardProps {
  insightType?: string  // identifies which feature this card belongs to
  evidence: Evidence[]
  insight: string | null
  isLoading: boolean
  error: boolean
}

function AIInsightCard({ insightType = 'unknown', evidence, insight, isLoading, error }: AIInsightCardProps) {
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

  return (
    <div>
      {/* Evidence panel — always visible, shows the data behind the insight */}
      <div>
        <p><strong>Evidence</strong></p>
        {evidence.map(e => (
          <span key={e.label}>{e.label}: {e.value} &nbsp;</span>
        ))}
      </div>

      {/* AI output */}
      {isLoading && <p>Generating insight...</p>}

      {error && (
        <p>AI insights temporarily unavailable. Your data is safe.</p>
      )}

      {!isLoading && !error && insight && (
        <p>{insight}</p>
      )}

      {/* Feedback buttons — only show after insight is generated */}
      {insight && !isLoading && (
        <div>
          <button
            onClick={() => handleFeedback('helpful')}
            style={{ fontWeight: feedback === 'helpful' ? 'bold' : 'normal' }}
          >
            👍 Helpful
          </button>
          <button
            onClick={() => handleFeedback('not_helpful')}
            style={{ fontWeight: feedback === 'not_helpful' ? 'bold' : 'normal' }}
          >
            👎 Not helpful
          </button>
        </div>
      )}
    </div>
  )
}

export default AIInsightCard