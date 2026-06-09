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

  // Derived display values
  const totalAttempted = sessions.reduce((sum, s) => sum + s.attempted, 0);
  const totalCorrect = sessions.reduce((sum, s) => sum + s.correct, 0);
  const overallAccuracy =
    totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

  const weakestTopic = weakTopics[0];
  const weakestTopicSessions = sessions.filter(
    (s) => s.topic === weakestTopic?.topic,
  );
  const weakestAttempted = weakestTopicSessions.reduce(
    (sum, s) => sum + s.attempted,
    0,
  );
  const weakestCorrect = weakestTopicSessions.reduce(
    (sum, s) => sum + s.correct,
    0,
  );
  const weakestToImprove = weakestAttempted - weakestCorrect;

  const pad = (n: number, len = 3) => String(n).padStart(len, "0");

  const barColor = (acc: number) =>
    acc < 50 ? "bg-red-500" : acc < 70 ? "bg-amber-400" : "bg-[#0D9488]";

  const trendMeta = (trend: string) => {
    if (trend === "improving") return { icon: "↑", color: "text-[#0D9488]" };
    if (trend === "declining") return { icon: "↓", color: "text-red-500" };
    return { icon: "—", color: "text-[#9CA3AF]" };
  };

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#F7F6F3' }}>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold tracking-tight text-[#1C1C1E]">
          Dashboard
        </h1>
        <p className="mt-0.5 text-sm text-[#9CA3AF]">
          Your overview of performance and priorities.
        </p>
      </div>

      {sessions.length === 0 ? (
        <div className="rounded-lg border border-[#E5E5E5] bg-white p-12 text-center">
          <p className="mb-2 text-[#374151]">
            Start logging study sessions to see your analytics.
          </p>
          <p className="text-sm text-[#9CA3AF]">
            Head to Study Sessions to log your first session.
          </p>
        </div>
      ) : (
        <>
          {/* ── Stat boxes ─────────────────────────────────────────────── */}
          <div className="mb-4 grid grid-cols-4 gap-3" style={{ maxWidth: '720px' }}>
            {[
              { label: "Sessions Logged", value: pad(sessions.length, 2), mono: true },
              { label: "Overall Accuracy", value: `${overallAccuracy}%`, mono: true },
              { label: "Mistakes Logged", value: pad(mistakes.length, 2), mono: true },
              { label: "Weakest Topic", value: weakestTopic?.topic ?? "—", mono: false },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-[#E5E5E5] bg-white px-4 py-3"
              >
                <p className="mb-1.5 text-[10px] font-medium uppercase tracking-widest text-[#9CA3AF]">
                  {stat.label}
                </p>
                <p
                  className={`text-[20px] leading-none text-[#1C1C1E] ${
                    stat.mono ? "font-mono font-semibold" : "font-semibold"
                  }`}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* ── Hero + Weak Topics ──────────────────────────────────────── */}
          <div className="mb-4 grid grid-cols-2 gap-4">
            {/* Hero card */}
            <div className="rounded-lg border border-[#E5E5E5] bg-white p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[13px] font-medium text-[#374151]">
                  Your Weakest Topic
                </span>
                <span className="rounded border border-red-200 bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-600">
                  Needs focus
                </span>
              </div>

              <h2 className="mb-2 text-[32px] font-bold leading-tight tracking-tight text-[#1C1C1E]">
                {weakestTopic?.topic}
              </h2>

              <div className="mb-1 flex items-baseline gap-2">
                <span className="font-mono text-[40px] font-bold leading-none text-[#0D9488]">
                  {weakestTopic?.averageAccuracy}%
                </span>
                <span className="text-lg text-[#9CA3AF]">correct</span>
              </div>

              <p className="mb-6 text-[13px] text-[#9CA3AF]">
                vs. {overallAccuracy}% overall average
              </p>

              <div className="space-y-2.5 border-t border-[#E5E5E5] pt-4">
                {[
                  { label: "Questions Attempted", value: pad(weakestAttempted) },
                  {
                    label: "Correct",
                    value: `${pad(weakestCorrect)} (${weakestTopic?.averageAccuracy}%)`,
                  },
                  { label: "Questions to Improve", value: pad(weakestToImprove) },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between">
                    <span className="text-[13px] text-[#6B7280]">{row.label}</span>
                    <span className="font-mono text-[13px] text-[#1C1C1E]">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Weak Topics list */}
            <div className="rounded-lg border border-[#E5E5E5] bg-white p-6">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[#374151]">
                  Weak Topics
                </h3>
                <button className="text-[12px] text-[#0D9488] hover:underline">
                  View all
                </button>
              </div>

              <div className="space-y-4">
                {weakTopics.slice(0, 6).map((t) => {
                  const { icon, color } = trendMeta(t.trend);
                  return (
                    <div key={t.topic}>
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="text-[13px] text-[#374151]">{t.topic}</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-[12px] ${color}`}>{icon}</span>
                          <span className="font-mono text-[13px] text-[#1C1C1E]">
                            {t.averageAccuracy}%
                          </span>
                        </div>
                      </div>
                      <div className="h-[3px] overflow-hidden rounded-full bg-[#F3F4F6]">
                        <div
                          className={`h-full rounded-full ${barColor(t.averageAccuracy)}`}
                          style={{ width: `${t.averageAccuracy}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Top Mistakes + AI Insight ───────────────────────────────── */}
          <div className="grid grid-cols-2 gap-4">
            {/* Top Mistakes */}
            <div className="rounded-lg border border-[#E5E5E5] bg-white p-6">
              <h3 className="mb-5 text-[11px] font-semibold uppercase tracking-widest text-[#374151]">
                Top Mistakes
              </h3>

              {mistakeFrequency.length === 0 ? (
                <p className="text-sm text-[#9CA3AF]">No mistakes logged yet.</p>
              ) : (
                <div>
                  {mistakeFrequency.slice(0, 3).map((m, i) => (
                    <div
                      key={m.topic}
                      className="flex items-center justify-between border-b border-[#E5E5E5] py-3.5 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-5 font-mono text-[11px] text-[#9CA3AF]">
                          {pad(i + 1, 2)}
                        </span>
                        <span className="text-[13px] text-[#374151]">{m.topic}</span>
                      </div>
                      <span className="rounded bg-[#F7F6F3] px-2 py-1 font-mono text-[13px] text-[#1C1C1E]">
                        {pad(m.count)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AI Insight */}
            <div className="rounded-lg border border-[#E5E5E5] bg-white p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[#374151]">
                  AI Insight
                </h3>
                <button
                  onClick={handleGenerate}
                  disabled={isLoading || weakTopics.length === 0}
                  className="flex items-center gap-1.5 rounded bg-[#0D9488] px-3 py-1.5 text-[12px] font-medium text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? "Generating…" : "Generate →"}
                </button>
              </div>

              {/* Evidence strip */}
              <div className="mb-4 rounded border border-[#CCFBF1] bg-[#F0FDFA] p-3">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#0D9488]">
                  Based on your data
                </p>
                <div className="flex gap-6">
                  <div>
                    <p className="text-[11px] text-[#6B7280]">Weakest topic</p>
                    <p className="text-[13px] font-medium text-[#1C1C1E]">
                      {weakTopics[0]?.topic ?? "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#6B7280]">Accuracy</p>
                    <p className="font-mono text-[13px] font-medium text-[#1C1C1E]">
                      {weakTopics[0]?.averageAccuracy ?? "—"}%
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#6B7280]">Trend</p>
                    <p className="text-[13px] font-medium capitalize text-[#1C1C1E]">
                      {weakTopics[0]?.trend ?? "—"}
                    </p>
                  </div>
                </div>
              </div>

              {sessions.length < 3 && (
                <p className="mb-3 text-[12px] text-[#9CA3AF]">
                  Keep logging — insights improve with more data.
                </p>
              )}

              {/* AIInsightCard handles loading / error / insight text / feedback */}
              {/* Hide its built-in evidence panel — we render our own above */}
              <div className="[&>div>div:first-child]:hidden [&_button]:mr-2 [&_button]:mt-1 [&_button]:text-sm [&_p]:text-[13px] [&_p]:leading-relaxed [&_p]:text-[#374151]">
                <AIInsightCard
                  insightType="dashboard_insight"
                  evidence={[]}
                  insight={insight?.detail ?? null}
                  isLoading={isLoading}
                  error={error}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DashboardPage;
