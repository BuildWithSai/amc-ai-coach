import { useState } from "react";
import { getSessions, getMistakes } from "../services/storage";
import {
  getRankedWeakTopics,
  getMistakeFrequencyByTopic,
} from "../analytics/computeAnalytics";
import { buildDashboardInsightPrompt } from "../prompts/dashboardInsight";
import { callOpenAI } from "../services/openai";
import AIInsightCard from "../components/AIInsightCard";
import type { DashboardInsightResponse } from "../types/aiResponses";

function DashboardPage() {
  // Load raw data from localStorage
  const sessions = getSessions();
  const mistakes = getMistakes();

  // Run analytics — these results go into the AI prompt, not raw data
  const weakTopics = getRankedWeakTopics(sessions);
  const mistakeFrequency = getMistakeFrequencyByTopic(mistakes);

  // Track the AI response, loading state, and error state
  const [insight, setInsight] = useState<DashboardInsightResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleGenerate = async () => {
    if (weakTopics.length === 0) return;

    setIsLoading(true);
    setError(false);

    // Build the prompt from computed analytics — never from raw sessions
    const systemPrompt =
      "You are an AMC exam study coach. Return only valid JSON.";
    const userPrompt = buildDashboardInsightPrompt(
      weakTopics,
      mistakeFrequency,
    );

    // Send to OpenAI and wait for typed response
    const result = await callOpenAI<DashboardInsightResponse>(
      systemPrompt,
      userPrompt,
    );

    if (result) {
      setInsight(result);
    } else {
      // If OpenAI fails, show error — never crash the page
      setError(true);
    }

    setIsLoading(false);
  };

  return (
    <div>
      <h1>Dashboard</h1>

      {/* If no sessions logged yet, show onboarding message */}
      {sessions.length === 0 ? (
        <p>Start logging study sessions to see your analytics.</p>
      ) : (
        <>
          <h2>Weak Topics</h2>
          {weakTopics.map((t) => (
            <div key={t.topic}>
              <p>
                {t.topic} — {t.averageAccuracy}% accuracy — {t.trend}
              </p>
            </div>
          ))}

          <h2>Top Mistakes</h2>
          {mistakeFrequency.length === 0 ? (
            <p>No mistakes logged yet.</p>
          ) : (
            mistakeFrequency.slice(0, 3).map((m) => (
              <div key={m.topic}>
                <p>
                  {m.topic} — {m.count} mistakes
                </p>
              </div>
            ))
          )}

          <h2>AI Insight</h2>

          {/* AI is never called automatically — always user initiated */}
          <button onClick={handleGenerate} disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate Insight"}
          </button>

          {/* Evidence panel always shows computed data alongside AI text */}
          <AIInsightCard
            insightType="dashboard_insight"
            evidence={[
              { label: "Weakest topic", value: weakTopics[0]?.topic },
              {
                label: "Accuracy",
                value: `${weakTopics[0]?.averageAccuracy}%`,
              },
              { label: "Trend", value: weakTopics[0]?.trend },
            ]}
            insight={insight?.detail ?? null}
            isLoading={isLoading}
            error={error}
          />
        </>
      )}
    </div>
  );
}

export default DashboardPage;
