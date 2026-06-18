/**
 * Three on-demand AI analysis panels: weak topic ranking, mistake pattern detection,
 * and prioritised study recommendations. Each panel triggers its own OpenAI call
 * independently. Sessions and mistakes are fetched from Supabase on mount.
 */
import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { getSessions, getMistakes } from "../services/storage";
import type { StudySession, Mistake } from "../types";
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
import { AppShell } from "../components/AppShell";
import { Button } from "../components/Button";
import { SectionTitle } from "../components/SectionTitle";

function GenerateButton({
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
}) {
  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      aria-busy={isLoading}
    >
      {isLoading ? (
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 animate-spin rounded-full border-[1.5px] border-gray-400 border-t-transparent" />
          {loadingLabel}
        </span>
      ) : label}
    </Button>
  );
}

function AICoachPage() {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [mistakes, setMistakes] = useState<Mistake[]>([]);

  useEffect(() => {
    getSessions().then(setSessions);
    getMistakes().then(setMistakes);
  }, []);

  const weakTopics = getRankedWeakTopics(sessions);
  const mistakeFrequency = getMistakeFrequencyByTopic(mistakes);

  const [weakTopicInsight, setWeakTopicInsight] =
    useState<WeakTopicAnalysisResponse | null>(null);
  const [isLoadingWeakTopics, setIsLoadingWeakTopics] = useState(false);
  const [weakTopicError, setWeakTopicError] = useState(false);

  const [mistakePatternInsight, setMistakePatternInsight] =
    useState<MistakePatternResponse | null>(null);
  const [isLoadingMistakePattern, setIsLoadingMistakePattern] = useState(false);
  const [mistakePatternError, setMistakePatternError] = useState(false);

  const [recommendationInsight, setRecommendationInsight] =
    useState<RecommendationResponse | null>(null);
  const [isLoadingRecommendations, setIsLoadingRecommendations] =
    useState(false);
  const [recommendationError, setRecommendationError] = useState(false);

  const handleWeakTopicAnalysis = async () => {
    if (weakTopics.length === 0) return;
    setIsLoadingWeakTopics(true);
    setWeakTopicError(false);
    const systemPrompt = "You are an AMC exam study coach. Return only valid JSON.";
    const userPrompt = buildWeakTopicAnalysisPrompt(weakTopics, mistakeFrequency);
    const result = await callOpenAI<WeakTopicAnalysisResponse>(systemPrompt, userPrompt);
    if (result) { setWeakTopicInsight(result); } else { setWeakTopicError(true); }
    setIsLoadingWeakTopics(false);
  };

  const handleMistakePatternAnalysis = async () => {
    if (mistakes.length === 0) return;
    setIsLoadingMistakePattern(true);
    setMistakePatternError(false);
    const systemPrompt = "You are an AMC exam study coach. Return only valid JSON.";
    const userPrompt = buildMistakePatternAnalysisPrompt(mistakes, mistakeFrequency);
    const result = await callOpenAI<MistakePatternResponse>(systemPrompt, userPrompt);
    if (result) { setMistakePatternInsight(result); } else { setMistakePatternError(true); }
    setIsLoadingMistakePattern(false);
  };

  const handleRecommendations = async () => {
    if (weakTopics.length === 0) return;
    setIsLoadingRecommendations(true);
    setRecommendationError(false);
    const systemPrompt = "You are an AMC exam study coach. Return only valid JSON.";
    const userPrompt = buildRecommendationsPrompt(weakTopics, mistakeFrequency);
    const result = await callOpenAI<RecommendationResponse>(systemPrompt, userPrompt);
    if (result) { setRecommendationInsight(result); } else { setRecommendationError(true); }
    setIsLoadingRecommendations(false);
  };

  const trendDelta = (trend?: string) => ({
    delta: trend === "improving" ? "↑ improving" : trend === "declining" ? "↓ declining" : "— stable",
    deltaColor: (trend === "improving" ? "green" : trend === "declining" ? "red" : "amber") as "green" | "red" | "amber",
  });

  return (
    <AppShell>
      <div className="mx-auto w-full px-4 py-6 sm:px-6 sm:py-8 lg:w-4/5">

        <SectionTitle
          title="AI Coach"
          subtitle="Interpretations of your computed analytics — every insight shows its evidence."
        />

        {sessions.length === 0 ? (
          <div className="rounded-xl bg-white">
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft">
                <Sparkles className="h-6 w-6 text-accent" />
              </div>
              <p className="text-[15px] font-semibold text-gray-900">No study data yet</p>
              <p className="mt-1.5 max-w-[280px] text-[14px] text-secondary">
                Log study sessions and mistakes to unlock AI-generated insights.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-5">

            {/* Weak Topic Analysis */}
            <div className="overflow-hidden rounded-xl bg-white">
              <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
                <div>
                  <h2 className="text-[17px] font-semibold text-gray-900">Weak Topic Analysis</h2>
                  {weakTopics.length === 1 && (
                    <p className="mt-0.5 text-[13px] text-secondary">
                      Only one topic logged — insights improve with more data.
                    </p>
                  )}
                </div>
                <GenerateButton
                  onClick={handleWeakTopicAnalysis}
                  disabled={isLoadingWeakTopics || weakTopics.length === 0}
                  isLoading={isLoadingWeakTopics}
                  label="Generate →"
                  loadingLabel="Analysing…"
                />
              </div>
              <div className="px-6 py-5">
                {!isLoadingWeakTopics && !weakTopicError && !weakTopicInsight && (
                  <p className="text-[14px] text-secondary">
                    Ranks your weakest topics from session accuracy and explains why each is lagging.
                  </p>
                )}
                <AIInsightCard
                  insightType="weak_topic_analysis"
                  evidence={[
                    { label: "Topics below 60%", value: String(weakTopics.filter((t) => t.averageAccuracy < 60).length) },
                    { label: "Most urgent", value: weakTopics[0]?.topic ?? "—", mono: false },
                    { label: "Accuracy", value: `${weakTopics[0]?.averageAccuracy ?? "—"}%`, ...trendDelta(weakTopics[0]?.trend) },
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

            {/* Mistake Patterns */}
            <div className="overflow-hidden rounded-xl bg-white">
              <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
                <h2 className="text-[17px] font-semibold text-gray-900">Mistake Patterns</h2>
                <GenerateButton
                  onClick={handleMistakePatternAnalysis}
                  disabled={isLoadingMistakePattern || mistakes.length === 0}
                  isLoading={isLoadingMistakePattern}
                  label="Generate →"
                  loadingLabel="Analysing…"
                />
              </div>
              <div className="px-6 py-5">
                {mistakes.length === 0 ? (
                  <p className="text-[14px] text-secondary">
                    No mistakes logged yet — log mistakes to surface recurring patterns.
                  </p>
                ) : (
                  <>
                    {!isLoadingMistakePattern && !mistakePatternError && !mistakePatternInsight && (
                      <p className="text-[14px] text-secondary">
                        Finds recurring error themes across your logged mistakes and suggests targeted fixes.
                      </p>
                    )}
                    <AIInsightCard
                      insightType="mistake_pattern_analysis"
                      evidence={[
                        { label: "Total mistakes", value: String(mistakes.length) },
                        { label: "Most common topic", value: mistakeFrequency[0]?.topic ?? "—", mono: false },
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

            {/* Recommendations */}
            <div className="overflow-hidden rounded-xl bg-white">
              <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
                <h2 className="text-[17px] font-semibold text-gray-900">Recommendations</h2>
                <GenerateButton
                  onClick={handleRecommendations}
                  disabled={isLoadingRecommendations || weakTopics.length === 0}
                  isLoading={isLoadingRecommendations}
                  label="Generate →"
                  loadingLabel="Generating…"
                />
              </div>
              <div className="px-6 py-5">
                {!isLoadingRecommendations && !recommendationError && !recommendationInsight && (
                  <p className="text-[14px] text-secondary">
                    Builds a prioritised study plan from your weak topics and mistake patterns.
                  </p>
                )}
                <AIInsightCard
                  insightType="recommendations"
                  evidence={[
                    { label: "Weak topics", value: String(weakTopics.length) },
                    { label: "Total mistakes", value: String(mistakes.length) },
                    { label: "Most urgent", value: weakTopics[0]?.topic ?? "—", mono: false },
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
    </AppShell>
  );
}

export default AICoachPage;
