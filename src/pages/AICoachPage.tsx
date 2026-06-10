import { useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  AlertTriangle,
  Sparkles,
  BarChart3,
} from "lucide-react";
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
    delta:
      trend === "improving"
        ? "↑ improving"
        : trend === "declining"
          ? "↓ declining"
          : "— stable",
    deltaColor: (trend === "improving"
      ? "green"
      : trend === "declining"
        ? "red"
        : "amber") as "green" | "red" | "amber",
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
      ) : (
        label
      )}
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
          <span className="text-[14px] font-semibold text-zinc-900">
            AMC Coach
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 px-3 pt-1">
          <Link
            to="/"
            className="flex w-full items-center gap-3 rounded-[7px] px-3 py-2 text-[13.5px] font-medium text-secondary transition-colors duration-150 hover:text-zinc-900"
          >
            <LayoutDashboard className="h-4 w-4 shrink-0" />
            Dashboard
          </Link>

          <Link
            to="/study-sessions"
            className="flex w-full items-center gap-3 rounded-[7px] px-3 py-2 text-[13.5px] font-medium text-secondary transition-colors duration-150 hover:text-zinc-900"
          >
            <BookOpen className="h-4 w-4 shrink-0" />
            Study Sessions
          </Link>

          <Link
            to="/mistakes"
            className="flex w-full items-center gap-3 rounded-[7px] px-3 py-2 text-[13.5px] font-medium text-secondary transition-colors duration-150 hover:text-zinc-900"
          >
            <AlertTriangle className="h-4 w-4 shrink-0" />
            Mistakes
          </Link>

          {/* AI Coach — active */}
          <Link
            to="/ai-coach"
            className="flex w-full items-center gap-3 rounded-[7px] bg-accent-soft px-3 py-2 text-[13.5px] font-medium text-accent transition-colors duration-150"
          >
            <Sparkles className="h-4 w-4 shrink-0" />
            AI Coach
          </Link>

          <span className="flex w-full cursor-not-allowed select-none items-center gap-3 rounded-[7px] px-3 py-2 text-[13.5px] font-medium text-zinc-300">
            <BarChart3 className="h-4 w-4 shrink-0" />
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
              Interpretations of your computed analytics — every insight shows
              its evidence.
            </p>
          </div>

          {sessions.length === 0 ? (
            /* ── No data empty state ────────────────────────────────── */
            <div className="flex flex-col items-center justify-center rounded-[10px] border border-black/[0.07] bg-white py-16 text-center">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft">
                <Sparkles className="h-5 w-5 text-accent" />
              </div>
              <p className="text-[14px] font-semibold text-zinc-900">
                No study data yet
              </p>
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
                  {!isLoadingWeakTopics &&
                    !weakTopicError &&
                    !weakTopicInsight && (
                      <p className="text-[13px] text-tertiary">
                        Ranks your weakest topics from session accuracy and
                        explains why each is lagging.
                      </p>
                    )}

                  <AIInsightCard
                    insightType="weak_topic_analysis"
                    evidence={[
                      {
                        label: "Topics below 60%",
                        value: String(
                          weakTopics.filter((t) => t.averageAccuracy < 60)
                            .length,
                        ),
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
                    keyTakeaway={
                      weakTopicInsight?.weakTopics[0]?.suggestedAction ?? null
                    }
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
                      No mistakes logged yet — log mistakes to surface recurring
                      patterns.
                    </p>
                  ) : (
                    <>
                      {/* Placeholder before first generation */}
                      {!isLoadingMistakePattern &&
                        !mistakePatternError &&
                        !mistakePatternInsight && (
                          <p className="text-[13px] text-tertiary">
                            Finds recurring error themes across your logged
                            mistakes and suggests targeted fixes.
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
                            delta:
                              mistakeFrequency[0]?.count > 3
                                ? "↑ high"
                                : "— moderate",
                            deltaColor:
                              mistakeFrequency[0]?.count > 3 ? "red" : "amber",
                          },
                        ]}
                        insight={mistakePatternInsight?.topPattern ?? null}
                        isLoading={isLoadingMistakePattern}
                        error={mistakePatternError}
                        keyTakeaway={
                          mistakePatternInsight?.patterns[0]?.suggestedFix ??
                          null
                        }
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
                    disabled={
                      isLoadingRecommendations || weakTopics.length === 0
                    }
                    isLoading={isLoadingRecommendations}
                    label="Generate →"
                    loadingLabel="Generating…"
                  />
                </div>

                <div className="px-6 py-5">
                  {/* Placeholder before first generation */}
                  {!isLoadingRecommendations &&
                    !recommendationError &&
                    !recommendationInsight && (
                      <p className="text-[13px] text-tertiary">
                        Builds a prioritised study plan from your weak topics
                        and mistake patterns.
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
                    keyTakeaway={
                      recommendationInsight?.recommendations[0]?.action ?? null
                    }
                    priority={
                      recommendationInsight?.recommendations[0]?.priority ??
                      null
                    }
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
