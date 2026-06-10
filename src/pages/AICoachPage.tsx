import { useState } from "react";
import { Link } from "react-router-dom";
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

  // ── Trend → delta colour mapping ──────────────────────────────────
  const trendDelta = (trend?: string) => ({
    delta: trend === "improving" ? "↑ improving" : trend === "declining" ? "↓ declining" : "— stable",
    deltaColor: (trend === "improving" ? "green" : trend === "declining" ? "red" : "amber") as "green" | "red" | "amber",
  });

  // ── Secondary "Generate" button ───────────────────────────────────
  const SecondaryButton = ({
    onClick,
    disabled,
    isLoading,
    loadingLabel,
    label,
  }: {
    onClick: () => void;
    disabled: boolean;
    isLoading: boolean;
    loadingLabel: string;
    label: string;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex shrink-0 items-center gap-1.5 rounded-[8px] border border-black/[0.12] bg-white px-3 py-1.5 text-[12px] font-medium text-secondary transition-all duration-150 hover:border-black/[0.2] hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isLoading ? (
        <>
          <span className="inline-block h-2.5 w-2.5 animate-spin rounded-full border-[1.5px] border-zinc-400 border-t-transparent" />
          {loadingLabel}
        </>
      ) : label}
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex overflow-hidden bg-zinc-50">

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside className="flex h-full w-60 shrink-0 flex-col border-r border-black/[0.07] bg-white">

        {/* Brand header */}
        <div className="flex items-center gap-2.5 px-5 py-5">
          <div className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded bg-accent text-[11px] font-medium text-white">
            AI
          </div>
          <span className="text-[14px] font-semibold text-zinc-900">AMC Coach</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 px-3 pt-1">
          <Link to="/" className="flex w-full items-center gap-3 rounded-[7px] px-3 py-2 text-[13.5px] font-medium text-secondary transition-colors duration-150 hover:text-zinc-900">
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
            Dashboard
          </Link>

          <Link to="/study-sessions" className="flex w-full items-center gap-3 rounded-[7px] px-3 py-2 text-[13.5px] font-medium text-secondary transition-colors duration-150 hover:text-zinc-900">
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            Study Sessions
          </Link>

          <Link to="/mistakes" className="flex w-full items-center gap-3 rounded-[7px] px-3 py-2 text-[13.5px] font-medium text-secondary transition-colors duration-150 hover:text-zinc-900">
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            Mistakes
          </Link>

          {/* AI Coach — active */}
          <Link to="/ai-coach" className="flex w-full items-center gap-3 rounded-[7px] bg-accent-soft px-3 py-2 text-[13.5px] font-medium text-accent transition-colors duration-150">
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
            </svg>
            AI Coach
          </Link>

          <span className="flex w-full cursor-not-allowed select-none items-center gap-3 rounded-[7px] px-3 py-2 text-[13.5px] font-medium text-zinc-300">
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
            Progress
          </span>
        </nav>

        {/* Bottom: user identity */}
        <div className="mt-auto border-t border-black/[0.07] px-5 py-4">
          <p className="text-sm font-semibold text-zinc-900">Dr. Priya</p>
          <p className="mt-0.5 text-xs text-secondary">AMC MCQ Part 1</p>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[900px] px-9 py-9">

          {/* Page header */}
          <div className="mb-7">
            <h1 className="text-[20px] font-semibold tracking-[-0.02em] text-zinc-900">
              AI coach
            </h1>
            <p className="mt-1 text-sm text-secondary">
              Interpretations of your computed analytics — every insight shows its evidence.
            </p>
          </div>

          {sessions.length === 0 ? (
            /* ── No data empty state ────────────────────────────────── */
            <div className="flex flex-col items-center justify-center rounded-[10px] border border-black/[0.07] bg-white py-16 text-center">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft">
                <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <p className="text-[14px] font-semibold text-zinc-900">No study data yet</p>
              <p className="mt-1 max-w-[280px] text-[13px] text-secondary">
                Log study sessions and mistakes to unlock AI-generated insights.
              </p>
            </div>
          ) : (
            <div className="space-y-6">

              {/* ── 1. Weak Topic Analysis ─────────────────────────────── */}
              <div className="overflow-hidden rounded-[10px] border border-black/[0.07] bg-white">
                <div className="flex items-center justify-between border-b border-black/[0.07] px-6 py-4">
                  <div>
                    <h2 className="text-[15px] font-semibold text-zinc-900">
                      Weak Topic Analysis
                    </h2>
                    {weakTopics.length === 1 && (
                      <p className="mt-0.5 text-[12px] text-tertiary">
                        Only one topic logged — insights improve with more data.
                      </p>
                    )}
                  </div>
                  <SecondaryButton
                    onClick={handleWeakTopicAnalysis}
                    disabled={isLoadingWeakTopics || weakTopics.length === 0}
                    isLoading={isLoadingWeakTopics}
                    label="Generate →"
                    loadingLabel="Analysing…"
                  />
                </div>

                <div className="px-6 py-5">
                  {/* Placeholder before first generation */}
                  {!isLoadingWeakTopics && !weakTopicError && !weakTopicInsight && (
                    <p className="text-[13px] text-tertiary">
                      Ranks your weakest topics from session accuracy and explains why each is lagging.
                    </p>
                  )}

                  <AIInsightCard
                    insightType="weak_topic_analysis"
                    evidence={[
                      {
                        label: "Topics below 60%",
                        value: String(weakTopics.filter((t) => t.averageAccuracy < 60).length),
                      },
                      {
                        label: "Most urgent",
                        value: weakTopics[0]?.topic ?? "—",
                        mono: false,
                      },
                      {
                        label: "Accuracy",
                        value: `${weakTopics[0]?.averageAccuracy ?? "—"}%`,
                        ...trendDelta(weakTopics[0]?.trend),
                      },
                    ]}
                    insight={weakTopicInsight?.topInsight ?? null}
                    isLoading={isLoadingWeakTopics}
                    error={weakTopicError}
                    keyTakeaway={weakTopicInsight?.weakTopics[0]?.suggestedAction ?? null}
                    confidence={weakTopicInsight?.confidence ?? null}
                    priority={weakTopicInsight?.weakTopics[0]?.priority ?? null}
                  />
                </div>
              </div>

              {/* ── 2. Mistake Pattern Analysis ────────────────────────── */}
              <div className="overflow-hidden rounded-[10px] border border-black/[0.07] bg-white">
                <div className="flex items-center justify-between border-b border-black/[0.07] px-6 py-4">
                  <h2 className="text-[15px] font-semibold text-zinc-900">
                    Mistake Patterns
                  </h2>
                  <SecondaryButton
                    onClick={handleMistakePatternAnalysis}
                    disabled={isLoadingMistakePattern || mistakes.length === 0}
                    isLoading={isLoadingMistakePattern}
                    label="Generate →"
                    loadingLabel="Analysing…"
                  />
                </div>

                <div className="px-6 py-5">
                  {mistakes.length === 0 ? (
                    <p className="text-[13px] text-tertiary">
                      No mistakes logged yet — log mistakes to surface recurring patterns.
                    </p>
                  ) : (
                    <>
                      {/* Placeholder before first generation */}
                      {!isLoadingMistakePattern && !mistakePatternError && !mistakePatternInsight && (
                        <p className="text-[13px] text-tertiary">
                          Finds recurring error themes across your logged mistakes and suggests targeted fixes.
                        </p>
                      )}

                      <AIInsightCard
                        insightType="mistake_pattern_analysis"
                        evidence={[
                          {
                            label: "Total mistakes",
                            value: String(mistakes.length),
                          },
                          {
                            label: "Most common topic",
                            value: mistakeFrequency[0]?.topic ?? "—",
                            mono: false,
                          },
                          {
                            label: "Frequency",
                            value: String(mistakeFrequency[0]?.count ?? "—"),
                            delta: mistakeFrequency[0]?.count > 3 ? "↑ high" : "— moderate",
                            deltaColor: mistakeFrequency[0]?.count > 3 ? "red" : "amber",
                          },
                        ]}
                        insight={mistakePatternInsight?.topPattern ?? null}
                        isLoading={isLoadingMistakePattern}
                        error={mistakePatternError}
                        keyTakeaway={mistakePatternInsight?.patterns[0]?.suggestedFix ?? null}
                        confidence={mistakePatternInsight?.confidence ?? null}
                      />
                    </>
                  )}
                </div>
              </div>

              {/* ── 3. Recommendations ─────────────────────────────────── */}
              <div className="overflow-hidden rounded-[10px] border border-black/[0.07] bg-white">
                <div className="flex items-center justify-between border-b border-black/[0.07] px-6 py-4">
                  <h2 className="text-[15px] font-semibold text-zinc-900">
                    Recommendations
                  </h2>
                  <SecondaryButton
                    onClick={handleRecommendations}
                    disabled={isLoadingRecommendations || weakTopics.length === 0}
                    isLoading={isLoadingRecommendations}
                    label="Generate →"
                    loadingLabel="Generating…"
                  />
                </div>

                <div className="px-6 py-5">
                  {/* Placeholder before first generation */}
                  {!isLoadingRecommendations && !recommendationError && !recommendationInsight && (
                    <p className="text-[13px] text-tertiary">
                      Builds a prioritised study plan from your weak topics and mistake patterns.
                    </p>
                  )}

                  <AIInsightCard
                    insightType="recommendations"
                    evidence={[
                      {
                        label: "Weak topics",
                        value: String(weakTopics.length),
                      },
                      {
                        label: "Total mistakes",
                        value: String(mistakes.length),
                      },
                      {
                        label: "Most urgent",
                        value: weakTopics[0]?.topic ?? "—",
                        mono: false,
                      },
                    ]}
                    insight={recommendationInsight?.summary ?? null}
                    isLoading={isLoadingRecommendations}
                    error={recommendationError}
                    keyTakeaway={recommendationInsight?.recommendations[0]?.action ?? null}
                    priority={recommendationInsight?.recommendations[0]?.priority ?? null}
                  />
                </div>
              </div>

            </div>
          )}
        </div>
      </main>

    </div>
  );
}

export default AICoachPage;
