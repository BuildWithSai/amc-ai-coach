import { useState } from "react";
import {
  TrendingDown,
  TrendingUp,
  Minus,
  Lightbulb,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { AppShell } from "../components/AppShell";
import { Button } from "../components/Button";
import { getSessions, getMistakes } from "../services/storage";
import {
  getRankedWeakTopics,
  getMistakeFrequencyByTopic,
  getPerformanceDelta,
} from "../analytics/computeAnalytics";
import { buildDashboardInsightPrompt } from "../prompts/dashboardInsight";
import { callOpenAI } from "../services/openai";
import type { DashboardInsightResponse } from "../types/aiResponses";

type StatItem = {
  label: string;
  value: string;
  delta: string;
  pos: boolean | null;
};
type TopicRow = {
  topic: string;
  acc: number;
  trend: number;
  mistakes: number;
  lastStudied: string;
};

function relativeTime(isoDate: string): string {
  const days = Math.floor(
    (Date.now() - new Date(isoDate).getTime()) / 86_400_000,
  );
  if (days === 0) return "Today";
  if (days === 1) return "1d ago";
  return `${days}d ago`;
}

function AccBar({ acc }: { acc: number }) {
  const fill = acc < 60 ? "bg-danger" : acc < 70 ? "bg-warning" : "bg-success";
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative h-1 w-16 overflow-hidden rounded-full bg-gray-200">
        <div
          className={`absolute inset-y-0 left-0 rounded-full ${fill}`}
          style={{ width: `${acc}%` }}
        />
      </div>
      <span className="tabular-nums text-[13px] text-gray-900">{acc}%</span>
    </div>
  );
}

function TrendCell({ trend }: { trend: number }) {
  if (trend < 0)
    return (
      <span className="flex items-center gap-1 tabular-nums text-[13px] text-danger">
        <TrendingDown className="h-3.5 w-3.5 shrink-0" />
        {trend}%
      </span>
    );
  if (trend > 0)
    return (
      <span className="flex items-center gap-1 tabular-nums text-[13px] text-success">
        <TrendingUp className="h-3.5 w-3.5 shrink-0" />+{trend}%
      </span>
    );
  return (
    <span className="flex items-center gap-1 tabular-nums text-[13px] text-tertiary">
      <Minus className="h-3.5 w-3.5 shrink-0" />
      0%
    </span>
  );
}

function DashboardPage() {
  const [insight, setInsight] = useState<DashboardInsightResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const sessions = getSessions();
  const mistakes = getMistakes();
  const weakTopics = getRankedWeakTopics(sessions);
  const mistakeFreq = getMistakeFrequencyByTopic(mistakes);

  const avgAccuracy =
    sessions.length > 0
      ? Math.round(
          sessions.reduce(
            (sum, s) => sum + (s.correct / s.attempted) * 100,
            0,
          ) / sessions.length,
        )
      : 0;

  const STATS: StatItem[] = [
    {
      label: "Avg accuracy",
      value: sessions.length > 0 ? `${avgAccuracy}%` : "—",
      delta: "—",
      pos: null,
    },
    {
      label: "Questions attempted",
      value: String(sessions.reduce((sum, s) => sum + s.attempted, 0)),
      delta: "—",
      pos: null,
    },
    {
      label: "Mistakes logged",
      value: String(mistakes.length),
      delta: "—",
      pos: null,
    },
    {
      label: "Study sessions",
      value: String(sessions.length),
      delta: "—",
      pos: null,
    },
  ];

  const TOPICS: TopicRow[] = weakTopics.map((t) => {
    const topicMistakes =
      mistakeFreq.find((m) => m.topic === t.topic)?.count ?? 0;
    const latestSession = sessions
      .filter((s) => s.topic === t.topic)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )[0];
    return {
      topic: t.topic,
      acc: t.averageAccuracy,
      trend: getPerformanceDelta(sessions, t.topic),
      mistakes: topicMistakes,
      lastStudied: latestSession ? relativeTime(latestSession.createdAt) : "—",
    };
  });

  const handleGenerateInsight = async () => {
    if (weakTopics.length === 0) return;
    const userPrompt = buildDashboardInsightPrompt(weakTopics, mistakeFreq);
    const systemPrompt =
      "You are an AI study coach for AMC MCQ Part 1 exam preparation.";
    setLoading(true);
    setError(false);
    const result = await callOpenAI<DashboardInsightResponse>(
      systemPrompt,
      userPrompt,
    );
    if (result) {
      setInsight(result);
    } else {
      setError(true);
    }
    setLoading(false);
  };

  const trendCls = (trend: DashboardInsightResponse["evidence"]["trend"]) =>
    trend === "declining"
      ? "text-danger"
      : trend === "improving"
        ? "text-success"
        : "text-tertiary";

  return (
    <AppShell>
      <div className="mx-auto w-4/5 px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-[30px] font-bold tracking-tight text-gray-900">
              Dashboard
            </h1>
            <p className="mt-1.5 text-[15px] text-secondary">
              24 sessions · last activity 2 days ago
            </p>
          </div>
          <Button
            type="button"
            className="mt-1"
            onClick={handleGenerateInsight}
            disabled={loading}
          >
            {loading ? "Generating…" : "Generate insight"}
          </Button>
        </div>

        {sessions.length === 0 ? (
          <p className="text-[14px] text-secondary">
            Start logging study sessions to see your analytics.
          </p>
        ) : (
          <>
            {/* Stats */}
            <div className="mb-6 grid grid-cols-4 gap-4">
              {STATS.map(({ label, value, delta, pos }) => (
                <div
                  key={label}
                  className="rounded-xl border border-black/10 bg-white p-5"
                >
                  <p className="mb-2 text-[13px] text-secondary">{label}</p>
                  <p className="tabular-nums text-[26px] font-bold leading-none text-gray-900">
                    {value}
                  </p>
                  <p
                    className={`mt-2 tabular-nums text-[13px] ${
                      pos === true
                        ? "text-success"
                        : pos === false
                          ? "text-danger"
                          : "text-tertiary"
                    }`}
                  >
                    {delta}
                  </p>
                </div>
              ))}
            </div>

            {/* AI Coaching Brief — error state */}
            {error && (
              <div className="mb-6 rounded-xl border border-black/10 bg-white p-6">
                <p className="text-[14px] text-secondary">
                  AI insights temporarily unavailable. Your data is safe.
                </p>
              </div>
            )}

            {/* AI Coaching Brief — insight state */}
            {insight && !error && (
              <div className="mb-6 rounded-xl border border-black/10 bg-white">
                <div className="grid grid-cols-[1fr_308px]">
                  {/* Left: insight + action */}
                  <div className="border-r border-black/5 p-6">
                    <h2 className="mb-3 text-[20px] font-semibold leading-snug text-balance text-gray-900">
                      {insight.headline}
                    </h2>
                    <p className="mb-5 max-w-[54ch] text-[15px] leading-relaxed text-secondary">
                      {insight.detail}
                    </p>

                    <div className="mb-6 rounded-xl bg-accent-soft p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 shrink-0 text-accent" />
                        <span className="text-[13px] font-semibold text-accent">
                          Recommended action
                        </span>
                      </div>
                      <p className="text-[14px] leading-relaxed text-gray-800">
                        {insight.actionLabel}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[13px] text-tertiary">Useful?</span>
                      <button
                        type="button"
                        aria-label="Helpful"
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-secondary transition-all duration-150 hover:bg-gray-200"
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        aria-label="Not helpful"
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-secondary transition-all duration-150 hover:bg-gray-200"
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Right: Evidence */}
                  <div className="p-6">
                    <p className="mb-4 text-[13px] font-medium text-secondary">
                      Evidence
                    </p>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                      <div>
                        <p className="tabular-nums text-[26px] font-bold leading-none text-gray-900">
                          {insight.evidence.accuracy}%
                        </p>
                        <p className="mt-2 text-[13px] text-secondary">
                          Accuracy
                        </p>
                        <p
                          className={`mt-1 text-[12px] capitalize ${trendCls(insight.evidence.trend)}`}
                        >
                          {insight.evidence.trend}
                        </p>
                      </div>
                      <div>
                        <p className="tabular-nums text-[26px] font-bold leading-none text-gray-900">
                          {mistakeFreq.find(
                            (m) => m.topic === insight.evidence.topic,
                          )?.count ?? 0}
                        </p>
                        <p className="mt-2 text-[13px] text-secondary">
                          Mistakes
                        </p>
                        <p className="mt-1 text-[12px] text-tertiary">
                          mistakes logged
                        </p>
                      </div>
                      <div>
                        <p className="tabular-nums text-[26px] font-bold leading-none text-gray-900">
                          {
                            sessions.filter(
                              (s) => s.topic === insight.evidence.topic,
                            ).length
                          }
                        </p>
                        <p className="mt-2 text-[13px] text-secondary">
                          Sessions
                        </p>
                        <p className="mt-1 text-[12px] text-tertiary">
                          sessions logged
                        </p>
                      </div>
                      <div>
                        <p className="text-[18px] font-bold leading-tight text-gray-900 line-clamp-2">
                          {insight.evidence.topic}
                        </p>
                        <p className="mt-2 text-[13px] text-secondary">
                          Top pattern
                        </p>
                        <p className="mt-1 text-[12px] text-tertiary">
                          priority topic
                        </p>
                      </div>
                    </div>
                    <p
                      className={`mt-6 text-right text-[12px] font-medium capitalize ${
                        insight.urgency === "high"
                          ? "text-danger"
                          : insight.urgency === "medium"
                            ? "text-warning"
                            : "text-success"
                      }`}
                    >
                      Urgency: {insight.urgency}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Topic Performance */}
            <div className="overflow-hidden rounded-xl border border-black/10 bg-white">
              <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
                <h2 className="text-[17px] font-semibold text-gray-900">
                  Topic Performance
                </h2>
                <span className="text-[13px] text-secondary">
                  {TOPICS.length} topics · sorted by accuracy
                </span>
              </div>

              <table className="w-full">
                <thead>
                  <tr className="border-b border-black/5">
                    {(
                      [
                        "Topic",
                        "Accuracy",
                        "Trend",
                        "Mistakes",
                        "Last studied",
                      ] as const
                    ).map((h) => (
                      <th
                        key={h}
                        className="px-6 py-3 text-left text-[12px] font-medium uppercase tracking-[0.06em] text-secondary"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {TOPICS.map((row) => (
                    <tr key={row.topic}>
                      <td className="px-6 py-3.5 text-[14px] font-medium text-gray-900">
                        {row.topic}
                      </td>
                      <td className="px-6 py-3.5">
                        <AccBar acc={row.acc} />
                      </td>
                      <td className="px-6 py-3.5">
                        <TrendCell trend={row.trend} />
                      </td>
                      <td className="px-6 py-3.5 tabular-nums text-[14px] text-gray-900">
                        {row.mistakes}
                      </td>
                      <td className="px-6 py-3.5 text-[13px] text-secondary">
                        {row.lastStudied}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}

export default DashboardPage;
