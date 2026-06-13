import { useState } from "react";
import {
  AlertTriangle,
  Activity,
  TrendingDown,
  TrendingUp,
  Minus,
  Lightbulb,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
} from "lucide-react";
import type { ElementType } from "react";
import { AppShell } from "../components/AppShell";
import { Button } from "../components/Button";
import { getSessions, getMistakes } from "../services/storage";
import {
  getRankedWeakTopics,
  getMistakeFrequencyByTopic,
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
type EvidenceItem = {
  icon: ElementType;
  label: string;
  value: string;
  sub: string;
  cls: string;
};

const STATS: StatItem[] = [
  { label: "Avg accuracy", value: "68%", delta: "+4% vs last week", pos: true },
  {
    label: "Questions attempted",
    value: "612",
    delta: "+96 this week",
    pos: true,
  },
  { label: "Mistakes logged", value: "47", delta: "12 unreviewed", pos: null },
  { label: "Study sessions", value: "24", delta: "last 30 days", pos: null },
];

const TOPICS: TopicRow[] = [
  {
    topic: "Cardiology",
    acc: 52,
    trend: -9,
    mistakes: 12,
    lastStudied: "2d ago",
  },
  {
    topic: "Pharmacology",
    acc: 58,
    trend: 0,
    mistakes: 9,
    lastStudied: "1d ago",
  },
  { topic: "Neurology", acc: 61, trend: 5, mistakes: 7, lastStudied: "3d ago" },
  {
    topic: "Endocrinology",
    acc: 64,
    trend: -3,
    mistakes: 8,
    lastStudied: "4d ago",
  },
  {
    topic: "Respiratory Medicine",
    acc: 71,
    trend: 6,
    mistakes: 4,
    lastStudied: "5d ago",
  },
];

const EVIDENCE: EvidenceItem[] = [
  {
    icon: Activity,
    label: "Accuracy",
    value: "52%",
    sub: "↓ 9% last 7 sessions",
    cls: "text-danger",
  },
  {
    icon: AlertTriangle,
    label: "Mistakes",
    value: "12",
    sub: "↑ 4 last 7 sessions",
    cls: "text-warning",
  },
  {
    icon: Activity,
    label: "Sessions",
    value: "6",
    sub: "Last 14 days",
    cls: "text-tertiary",
  },
  {
    icon: Activity,
    label: "Top pattern",
    value: "ECG",
    sub: "SVT vs AFib",
    cls: "text-tertiary",
  },
];

function AccBar({ acc }: { acc: number }) {
  const fill = acc < 60 ? "bg-danger" : acc < 70 ? "bg-warning" : "bg-success";
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative h-1 w-16 overflow-hidden rounded-full bg-muted/50">
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

  const handleGenerateInsight = async () => {
    const sessions = getSessions();
    const mistakes = getMistakes();
    const weakTopics = getRankedWeakTopics(sessions);
    if (weakTopics.length === 0) return;
    const mistakeFreq = getMistakeFrequencyByTopic(mistakes);
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
        <div className="mb-8">
          <h1 className="text-[30px] font-bold tracking-tight text-primary">
            Dashboard
          </h1>
          <p className="mt-1.5 text-[15px] text-secondary">
            24 sessions · last activity 2 days ago
          </p>
        </div>

        {/* ── AI Insight Hero ── */}
        <div className="mb-8">
          {/* Pre-generation: prompt card */}
          {!insight && !loading && !error && (
            <div
              className="rounded-xl bg-surface px-8 py-10"
              style={{ boxShadow: "var(--shadow-card-raised)" }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-accent/[0.08]">
                  <Sparkles className="h-5 w-5 text-accent" />
                </div>
                <h2 className="text-[17px] font-semibold text-primary">
                  What should you focus on today?
                </h2>
                <p className="mt-1.5 max-w-[380px] text-[14px] leading-relaxed text-secondary">
                  Generate an AI analysis of your study data to identify your
                  highest-priority gap and get a concrete action plan.
                </p>
                <Button
                  type="button"
                  className="mt-5"
                  onClick={handleGenerateInsight}
                >
                  Generate insight
                </Button>
              </div>
            </div>
          )}

          {/* Loading: skeleton */}
          {loading && (
            <div
              className="rounded-xl bg-surface p-8"
              style={{ boxShadow: "var(--shadow-card-raised)" }}
            >
              <div className="animate-pulse">
                <div className="mb-5 flex items-center gap-3">
                  <div className="h-3 w-20 rounded-full bg-muted/40" />
                  <div className="h-5 w-14 rounded-full bg-muted/30" />
                </div>
                <div className="mb-3 h-6 w-3/5 rounded-lg bg-muted/50" />
                <div className="mb-2 h-4 w-full rounded-lg bg-muted/30" />
                <div className="mb-2 h-4 w-[92%] rounded-lg bg-muted/30" />
                <div className="mb-6 h-4 w-[78%] rounded-lg bg-muted/30" />
                <div className="h-20 w-full rounded-xl bg-muted/20" />
              </div>
            </div>
          )}

          {/* Error state */}
          {error && !loading && (
            <div
              className="rounded-xl bg-surface p-8"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="flex flex-col items-center py-4 text-center">
                <p className="text-[15px] font-medium text-primary">
                  Unable to generate insight
                </p>
                <p className="mt-1 text-[14px] text-secondary">
                  AI insights are temporarily unavailable. Your data is safe.
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  className="mt-4"
                  onClick={handleGenerateInsight}
                >
                  Try again
                </Button>
              </div>
            </div>
          )}

          {/* Insight hero — the main event */}
          {insight && !error && (
            <div
              className="overflow-hidden rounded-xl bg-surface"
              style={{ boxShadow: "var(--shadow-card-raised)" }}
            >
              {/* ── Analysis zone ── */}
              <div className="px-8 pt-7 pb-6">
                {/* Meta row: label + urgency + confidence */}
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-accent" />
                    <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-accent">
                      AI Insight
                    </span>
                  </div>
                  <span
                    className={`rounded-full px-2 py-[2px] text-[11px] font-medium capitalize ${
                      insight.urgency === "high"
                        ? "bg-danger/[0.08] text-danger"
                        : insight.urgency === "medium"
                          ? "bg-warning/[0.08] text-warning"
                          : "bg-tertiary/[0.15] text-tertiary"
                    }`}
                  >
                    {insight.urgency} urgency
                  </span>
                </div>

                {/* Headline */}
                <h2 className="mb-3 text-[22px] font-bold leading-snug tracking-[-0.01em] text-primary text-balance">
                  {insight.headline}
                </h2>

                {/* Analysis body */}
                <p className="mb-6 max-w-[60ch] text-[15px] leading-[1.7] text-secondary">
                  {insight.detail}
                </p>

                {/* ── Recommended Action callout ── */}
                <div className="rounded-xl border-l-[3px] border-accent bg-accent/[0.04] px-5 py-4">
                  <div className="mb-1.5 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 shrink-0 text-accent" />
                    <span className="text-[12px] font-semibold uppercase tracking-[0.06em] text-accent">
                      Recommended action
                    </span>
                  </div>
                  <p className="max-w-[56ch] text-[14px] leading-relaxed text-primary">
                    {insight.actionLabel}
                  </p>
                </div>
              </div>

              {/* ── Evidence + Feedback footer ── */}
              <div className="flex items-center justify-between border-t border-border bg-surface-alt px-8 py-4">
                {/* Evidence stats row */}
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-tertiary">
                      Evidence
                    </span>
                    <span className="h-3 w-px bg-border" />
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="tabular-nums text-[16px] font-bold text-primary">
                      {insight.evidence.accuracy}%
                    </span>
                    <span className="text-[12px] text-secondary">accuracy</span>
                    <span
                      className={`ml-1 text-[12px] capitalize ${trendCls(insight.evidence.trend)}`}
                    >
                      · {insight.evidence.trend}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[14px] font-semibold text-primary">
                      {insight.evidence.topic}
                    </span>
                    <span className="text-[12px] text-secondary">
                      priority topic
                    </span>
                  </div>
                </div>

                {/* Feedback */}
                <div className="flex items-center gap-2">
                  <span className="mr-1 text-[12px] text-tertiary">
                    Helpful?
                  </span>
                  <button
                    type="button"
                    aria-label="Helpful"
                    className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px] border border-border text-tertiary transition-all duration-150 hover:border-accent/30 hover:bg-accent/[0.04] hover:text-accent"
                  >
                    <ThumbsUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Not helpful"
                    className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px] border border-border text-tertiary transition-all duration-150 hover:border-danger/30 hover:bg-danger/[0.04] hover:text-danger"
                  >
                    <ThumbsDown className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Topic Performance */}
        <div
          className="overflow-hidden rounded-xl bg-surface"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="text-[17px] font-semibold text-gray-900">
              Topic Performance
            </h2>
            <span className="text-[13px] text-secondary">
              5 topics · sorted by accuracy
            </span>
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b border-border-row">
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
            <tbody className="divide-y divide-border-row">
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
      </div>
    </AppShell>
  );
}

export default DashboardPage;
