import { useState } from "react";
import { getSessions, getMistakes } from "../services/storage";
import {
  getRankedWeakTopics,
  getMistakeFrequencyByTopic,
} from "../analytics/computeAnalytics";
import { buildWeakTopicAnalysisPrompt } from "../prompts/weakTopicAnalysis";
import { buildMistakePatternAnalysisPrompt } from "../prompts/mistakePatternAnalysis";
import { buildRecommendationsPrompt } from "../prompts/recommendations";
import { callOpenAI } from "../services/openai";
import AIInsightCard from "../components/AIInsightCard";
import type { WeakTopicAnalysisResponse } from "../types/aiResponses";
import type { MistakePatternResponse } from "../types/aiResponses";
import type { RecommendationResponse } from "../types/aiResponses";

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

  // State for recommendations section
  const [recommendationInsight, setRecommendationInsight] =
    useState<RecommendationResponse | null>(null);
  const [isLoadingRecommendations, setIsLoadingRecommendations] =
    useState(false);
  const [recommendationError, setRecommendationError] = useState(false);

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

  const handleRecommendations = async () => {
    // Need at least some data to generate recommendations
    if (weakTopics.length === 0) return;

    setIsLoadingRecommendations(true);
    setRecommendationError(false);

    const systemPrompt =
      "You are an AMC exam study coach. Return only valid JSON.";
    const userPrompt = buildRecommendationsPrompt(weakTopics, mistakeFrequency);

    const result = await callOpenAI<RecommendationResponse>(
      systemPrompt,
      userPrompt,
    );

    if (result) {
      setRecommendationInsight(result);
    } else {
      setRecommendationError(true);
    }

    setIsLoadingRecommendations(false);
  };

  // ── Shared sub-components (render helpers, no state) ──────────────

  const EvidenceStrip = ({
    items,
  }: {
    items: { label: string; value: string | number; mono?: boolean }[];
  }) => (
    <div className="mb-4 rounded border border-[#CCFBF1] bg-[#F0FDFA] p-3">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#0D9488]">
        Based on your data
      </p>
      <div className="flex flex-wrap gap-6">
        {items.map((item) => (
          <div key={item.label}>
            <p className="text-[11px] text-[#6B7280]">{item.label}</p>
            <p
              className={`text-[13px] font-semibold text-[#1C1C1E] ${item.mono ? "font-mono" : ""}`}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  const Skeleton = () => (
    <div className="animate-pulse space-y-2">
      <div className="h-2.5 rounded bg-[#E5E5E5]" />
      <div className="h-2.5 w-5/6 rounded bg-[#E5E5E5]" />
      <div className="h-2.5 w-4/6 rounded bg-[#E5E5E5]" />
    </div>
  );

  const GenerateButton = ({
    onClick,
    disabled,
    label,
    loadingLabel,
    isLoading,
  }: {
    onClick: () => void;
    disabled: boolean;
    label: string;
    loadingLabel: string;
    isLoading: boolean;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex-shrink-0 rounded px-3 py-1.5 text-[12px] font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      style={{ backgroundColor: "#0D9488" }}
    >
      {isLoading ? loadingLabel : label}
    </button>
  );

  // AIInsightCard is used here only for its feedback-saving behaviour.
  // Its built-in evidence panel and text rendering are suppressed via CSS
  // so we can show our own styled versions above it.
  const FeedbackRow = ({
    insightType,
    insight,
  }: {
    insightType: string;
    insight: string | null;
  }) =>
    insight ? (
      <div
        className="mt-4 border-t border-[#E5E5E5] pt-3"
        // Hide AIInsightCard's evidence panel (first-child div) and all its <p> tags;
        // only the feedback <button> elements inside its div remain visible.
        style={{ lineHeight: 1 }}
      >
        <div className="[&>div>div:first-child]:hidden [&>div>p]:hidden [&_button]:mr-2 [&_button]:cursor-pointer [&_button]:rounded [&_button]:border [&_button]:border-[#E5E5E5] [&_button]:bg-white [&_button]:px-2.5 [&_button]:py-1 [&_button]:text-[12px] [&_button]:text-[#6B7280]">
          <AIInsightCard
            insightType={insightType}
            evidence={[]}
            insight={insight}
            isLoading={false}
            error={false}
          />
        </div>
      </div>
    ) : null;

  // ── Page ──────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: "#F7F6F3" }}>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold tracking-tight text-[#1C1C1E]">
          AI Coach
        </h1>
        <p className="mt-0.5 text-sm text-[#9CA3AF]">
          Personalised insights to help you improve faster.
        </p>
      </div>

      {sessions.length === 0 ? (
        <div className="rounded-lg border border-[#E5E5E5] bg-white p-10 text-center">
          <p className="text-sm text-[#9CA3AF]">
            Start logging study sessions to see your AI insights.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* ── 1. Weak Topic Analysis ──────────────────────────────── */}
          <div className="rounded-lg border border-[#E5E5E5] bg-white">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] px-6 py-4">
              <div>
                <h2 className="text-[14px] font-semibold text-[#1C1C1E]">
                  1. Weak Topic Analysis
                </h2>
                {weakTopics.length === 1 && (
                  <p className="mt-0.5 text-[11px] text-[#9CA3AF]">
                    Only one topic logged — insights improve with more topics.
                  </p>
                )}
              </div>
              {/* Original code has an empty button before the real one — kept hidden */}
              <button
                onClick={handleWeakTopicAnalysis}
                disabled={isLoadingWeakTopics}
                className="hidden"
              />
              <GenerateButton
                onClick={handleWeakTopicAnalysis}
                disabled={isLoadingWeakTopics}
                label="Generate →"
                loadingLabel="Analysing…"
                isLoading={isLoadingWeakTopics}
              />
            </div>

            <div className="p-6">
              <EvidenceStrip
                items={[
                  {
                    label: "Topics below 60%",
                    value: weakTopics.filter((t) => t.averageAccuracy < 60)
                      .length,
                    mono: true,
                  },
                  {
                    label: "Most urgent",
                    value: weakTopics[0]?.topic ?? "—",
                  },
                  {
                    label: "Accuracy",
                    value: `${weakTopics[0]?.averageAccuracy ?? "—"}%`,
                    mono: true,
                  },
                ]}
              />

              {isLoadingWeakTopics && <Skeleton />}

              {weakTopicError && !isLoadingWeakTopics && (
                <p className="text-[13px] text-red-500">
                  AI insights temporarily unavailable. Your data is safe.
                </p>
              )}

              {!isLoadingWeakTopics && !weakTopicError && weakTopicInsight && (
                <p className="text-[13px] leading-relaxed text-[#374151]">
                  {weakTopicInsight.topInsight}
                </p>
              )}

              <FeedbackRow
                insightType="weak_topic_analysis"
                insight={weakTopicInsight?.topInsight ?? null}
              />
            </div>
          </div>

          {/* ── 2. Mistake Pattern Analysis ─────────────────────────── */}
          <div className="rounded-lg border border-[#E5E5E5] bg-white">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] px-6 py-4">
              <h2 className="text-[14px] font-semibold text-[#1C1C1E]">
                2. Mistake Patterns
              </h2>
              <GenerateButton
                onClick={handleMistakePatternAnalysis}
                disabled={isLoadingMistakePattern || mistakes.length === 0}
                label="Generate →"
                loadingLabel="Analysing…"
                isLoading={isLoadingMistakePattern}
              />
            </div>

            <div className="p-6">
              {mistakes.length === 0 ? (
                <p className="text-[13px] text-[#9CA3AF]">
                  No mistakes logged yet. Start logging mistakes to see
                  patterns.
                </p>
              ) : (
                <>
                  <EvidenceStrip
                    items={[
                      {
                        label: "Total mistakes",
                        value: mistakes.length,
                        mono: true,
                      },
                      {
                        label: "Most common topic",
                        value: mistakeFrequency[0]?.topic ?? "—",
                      },
                      {
                        label: "Count",
                        value: mistakeFrequency[0]?.count ?? "—",
                        mono: true,
                      },
                    ]}
                  />

                  {isLoadingMistakePattern && <Skeleton />}

                  {mistakePatternError && !isLoadingMistakePattern && (
                    <p className="text-[13px] text-red-500">
                      AI insights temporarily unavailable. Your data is safe.
                    </p>
                  )}

                  {!isLoadingMistakePattern &&
                    !mistakePatternError &&
                    mistakePatternInsight && (
                      <p className="text-[13px] leading-relaxed text-[#374151]">
                        {mistakePatternInsight.topPattern}
                      </p>
                    )}

                  <FeedbackRow
                    insightType="mistake_pattern_analysis"
                    insight={mistakePatternInsight?.topPattern ?? null}
                  />
                </>
              )}
            </div>
          </div>

          {/* ── 3. Recommendations ──────────────────────────────────── */}
          <div className="rounded-lg border border-[#E5E5E5] bg-white">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] px-6 py-4">
              <h2 className="text-[14px] font-semibold text-[#1C1C1E]">
                3. Recommendations
              </h2>
              <GenerateButton
                onClick={handleRecommendations}
                disabled={isLoadingRecommendations}
                label="Generate →"
                loadingLabel="Generating…"
                isLoading={isLoadingRecommendations}
              />
            </div>

            <div className="p-6">
              <EvidenceStrip
                items={[
                  {
                    label: "Weak topics",
                    value: weakTopics.length,
                    mono: true,
                  },
                  {
                    label: "Total mistakes",
                    value: mistakes.length,
                    mono: true,
                  },
                  {
                    label: "Most urgent",
                    value: weakTopics[0]?.topic ?? "—",
                  },
                ]}
              />

              {isLoadingRecommendations && <Skeleton />}

              {recommendationError && !isLoadingRecommendations && (
                <p className="text-[13px] text-red-500">
                  AI insights temporarily unavailable. Your data is safe.
                </p>
              )}

              {!isLoadingRecommendations &&
                !recommendationError &&
                recommendationInsight && (
                  <p className="text-[13px] leading-relaxed text-[#374151]">
                    {recommendationInsight.summary}
                  </p>
                )}

              <FeedbackRow
                insightType="recommendations"
                insight={recommendationInsight?.summary ?? null}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AICoachPage;
