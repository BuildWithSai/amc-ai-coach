import { useState } from "react";
import { getSessions, getMistakes } from "../services/storage";
import {
  getRankedWeakTopics,
  getMistakeFrequencyByTopic,
} from "../analytics/computeAnalytics";
import { buildWeakTopicAnalysisPrompt } from "../prompts/weakTopicAnalysis";
import { buildMistakePatternAnalysisPrompt } from "../prompts/mistakePatternAnalysis";
import { callOpenAI } from "../services/openai";
import AIInsightCard from "../components/AIInsightCard";
import type { WeakTopicAnalysisResponse } from "../types/aiResponses";
import type { MistakePatternResponse } from "../types/aiResponses";

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

  // State for mistake pattern analysis section
  const [mistakePatternInsight, setMistakePatternInsight] =
    useState<MistakePatternResponse | null>(null);
  const [isLoadingMistakePattern, setIsLoadingMistakePattern] = useState(false);
  const [mistakePatternError, setMistakePatternError] = useState(false);

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

  const handleMistakePatternAnalysis = async () => {
    // If no mistakes logged yet, do nothing
    if (mistakes.length === 0) return;

    setIsLoadingMistakePattern(true);
    setMistakePatternError(false);

    const systemPrompt =
      "You are an AMC exam study coach. Return only valid JSON.";
    const userPrompt = buildMistakePatternAnalysisPrompt(
      mistakes,
      mistakeFrequency,
    );

    const result = await callOpenAI<MistakePatternResponse>(
      systemPrompt,
      userPrompt,
    );

    if (result) {
      setMistakePatternInsight(result);
    } else {
      setMistakePatternError(true);
    }

    setIsLoadingMistakePattern(false);
  };

  return (
    <div>
      <h1>AI Coach</h1>

      {/* If no sessions logged yet, show onboarding message */}
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

          {/* Mistake Pattern Analysis */}
          <h2>Mistake Pattern Analysis</h2>
          {mistakes.length === 0 ? (
            <p>
              No mistakes logged yet. Start logging mistakes to see patterns.
            </p>
          ) : (
            <>
              <button
                onClick={handleMistakePatternAnalysis}
                disabled={isLoadingMistakePattern}
              >
                {isLoadingMistakePattern
                  ? "Analysing..."
                  : "Analyse Mistake Patterns"}
              </button>

              <AIInsightCard
                evidence={[
                  { label: "Total mistakes", value: `${mistakes.length}` },
                  {
                    label: "Most common topic",
                    value: mistakeFrequency[0]?.topic,
                  },
                  { label: "Count", value: `${mistakeFrequency[0]?.count}` },
                ]}
                insight={mistakePatternInsight?.topPattern ?? null}
                isLoading={isLoadingMistakePattern}
                error={mistakePatternError}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default AICoachPage;
