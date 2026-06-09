import { useState } from "react";
import { getSessions, getMistakes } from "../services/storage";
import {
  getRankedWeakTopics,
  getMistakeFrequencyByTopic,
} from "../analytics/computeAnalytics";
import { buildWeakTopicAnalysisPrompt } from "../prompts/weakTopicAnalysis";
import { callOpenAI } from "../services/openai";
import AIInsightCard from "../components/AIInsightCard";
import type { WeakTopicAnalysisResponse } from "../types/aiResponses";

function AICoachPage() {
  // Load data and compute analytics — same pattern as dashboard
  const sessions = getSessions();
  const mistakes = getMistakes();
  const weakTopics = getRankedWeakTopics(sessions);
  const mistakeFrequency = getMistakeFrequencyByTopic(mistakes);

  // State for weak topic analysis section
  const [weakTopicInsight, setWeakTopicInsight] =
    useState<WeakTopicAnalysisResponse | null>(null);
  const [isLoadingWeakTopics, setIsLoadingWeakTopics] = useState(false);
  const [weakTopicError, setWeakTopicError] = useState(false);

  const handleWeakTopicAnalysis = async () => {
    if (weakTopics.length === 0) return;

    setIsLoadingWeakTopics(true);
    setWeakTopicError(false);

    const systemPrompt =
      "You are an AMC exam study coach. Return only valid JSON.";
    const userPrompt = buildWeakTopicAnalysisPrompt(
      weakTopics,
      mistakeFrequency,
    );

    const result = await callOpenAI<WeakTopicAnalysisResponse>(
      systemPrompt,
      userPrompt,
    );

    if (result) {
      setWeakTopicInsight(result);
    } else {
      setWeakTopicError(true);
    }

    setIsLoadingWeakTopics(false);
  };

  return (
    <div>
      <h1>AI Coach</h1>

      {sessions.length === 0 ? (
        <p>Start logging study sessions to see your AI insights.</p>
      ) : (
        <>
          {/* Weak Topic Analysis */}
          <h2>Weak Topic Analysis</h2>
          <button
            onClick={handleWeakTopicAnalysis}
            disabled={isLoadingWeakTopics}
          >
            {isLoadingWeakTopics ? "Analysing..." : "Analyse Weak Topics"}
          </button>

          <AIInsightCard
            evidence={[
              {
                label: "Topics below 60%",
                value: `${weakTopics.filter((t) => t.averageAccuracy < 60).length}`,
              },
              { label: "Most urgent", value: weakTopics[0]?.topic },
              {
                label: "Accuracy",
                value: `${weakTopics[0]?.averageAccuracy}%`,
              },
            ]}
            insight={weakTopicInsight?.topInsight ?? null}
            isLoading={isLoadingWeakTopics}
            error={weakTopicError}
          />
        </>
      )}
    </div>
  );
}

export default AICoachPage;
