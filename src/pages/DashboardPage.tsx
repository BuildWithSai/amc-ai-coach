/**
 * Summary view showing accuracy stats, question totals, and a topic performance table
 * sorted by weakest accuracy first. The "Generate insight" button calls OpenAI with
 * the computed analytics and renders a coaching brief with evidence.
 */
import { useState, useEffect } from "react";
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
import { TopicPill } from "../constants/topicColors";
import type { StudySession, Mistake, AMCTopic } from "../types";
import {
  getRankedWeakTopics,
  getMistakeFrequencyByTopic,
  getPerformanceDelta,
} from "../analytics/computeAnalytics";
import { buildDashboardInsightPrompt } from "../prompts/dashboardInsight";
import { callOpenAI } from "../services/openai";
import type { DashboardInsightResponse } from "../types/aiResponses";
import { saveAIFeedback } from "../services/aiFeedback";
import { v4 as uuidv4 } from "uuid";
import {
  getSessions,
  getMistakes,
  saveAIInteraction,
} from "../services/storage";

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
    <div
      className="flex items-center gap-2.5"
      role="meter"
      aria-valuenow={acc}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Accuracy"
    >
      <div className="relative h-1 w-16 overflow-hidden rounded-full bg-black/10">
        <div
          className={`absolute inset-y-0 left-0 rounded-full ${fill}`}
          style={{ width: `${acc}%` }}
        />
      </div>
      <span className="tabular-nums text-[18px] font-medium text-gray-900">
        {acc}%
      </span>
    </div>
  );
}

function TrendCell({ trend }: { trend: number }) {
  if (trend < 0)
    return (
      <span className="flex items-center gap-1.5 tabular-nums text-[18px] font-medium text-danger">
        <TrendingDown className="h-5 w-5 shrink-0" />
        {trend}%
      </span>
    );
  if (trend > 0)
    return (
      <span className="flex items-center gap-1.5 tabular-nums text-[18px] font-medium text-success">
        <TrendingUp className="h-5 w-5 shrink-0" />+{trend}%
      </span>
    );
  return (
    <span className="flex items-center gap-1.5 tabular-nums text-[18px] font-medium text-secondary">
      <Minus className="h-5 w-5 shrink-0" />
      0%
    </span>
  );
}

function splitByWeek<T>(items: T[], getDate: (item: T) => string) {
  const now = Date.now();
  const thisWeek: T[] = [];
  const lastWeek: T[] = [];
  for (const item of items) {
    const age = now - new Date(getDate(item)).getTime();
    if (age < 7 * 86_400_000) thisWeek.push(item);
    else if (age < 14 * 86_400_000) lastWeek.push(item);
  }
  return { thisWeek, lastWeek };
}

function weekDeltaText(
  delta: number,
  hasData: boolean,
  unit = "",
  invert = false,
): { text: string; pos: boolean | null } {
  if (!hasData) return { text: "Not enough data yet", pos: null };
  if (delta === 0) return { text: "No change vs last week", pos: null };
  const positive = invert ? delta < 0 : delta > 0;
  return {
    text: `${delta > 0 ? "+" : ""}${delta}${unit} vs last week`,
    pos: positive,
  };
}

function DashboardPage() {
  const [insight, setInsight] = useState<DashboardInsightResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<
    "helpful" | "not_helpful" | null
  >(null);

  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [mistakes, setMistakes] = useState<Mistake[]>([]);

  useEffect(() => {
    getSessions().then(setSessions);
    getMistakes().then(setMistakes);
  }, []);
  const weakTopics = getRankedWeakTopics(sessions);
  const mistakeFreq = getMistakeFrequencyByTopic(mistakes);

  const { thisWeek: sessThisWeek, lastWeek: sessLastWeek } = splitByWeek(
    sessions,
    (s) => s.createdAt,
  );
  const { thisWeek: mistThisWeek, lastWeek: mistLastWeek } = splitByWeek(
    mistakes,
    (m) => m.createdAt,
  );

  const sessHasData = sessThisWeek.length > 0 && sessLastWeek.length > 0;
  const mistHasData = mistThisWeek.length > 0 || mistLastWeek.length > 0;

  const avgAcc = (ss: StudySession[]) =>
    ss.reduce((sum, s) => sum + (s.correct / s.attempted) * 100, 0) / ss.length;
  const accDelta = weekDeltaText(
    sessHasData ? Math.round(avgAcc(sessThisWeek) - avgAcc(sessLastWeek)) : 0,
    sessHasData,
    "%",
  );
  const qDelta = weekDeltaText(
    sessHasData
      ? sessThisWeek.reduce((n, s) => n + s.attempted, 0) -
          sessLastWeek.reduce((n, s) => n + s.attempted, 0)
      : 0,
    sessHasData,
  );
  const mistDelta = weekDeltaText(
    mistHasData ? mistThisWeek.length - mistLastWeek.length : 0,
    mistHasData,
    "",
    true,
  );
  const sessCntDelta = weekDeltaText(
    sessHasData ? sessThisWeek.length - sessLastWeek.length : 0,
    sessHasData,
  );

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
      delta: accDelta.text,
      pos: accDelta.pos,
    },
    {
      label: "Questions attempted",
      value: String(sessions.reduce((sum, s) => sum + s.attempted, 0)),
      delta: qDelta.text,
      pos: qDelta.pos,
    },
    {
      label: "Mistakes logged",
      value: String(mistakes.length),
      delta: mistDelta.text,
      pos: mistDelta.pos,
    },
    {
      label: "Study sessions",
      value: String(sessions.length),
      delta: sessCntDelta.text,
      pos: sessCntDelta.pos,
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
    setFeedbackGiven(null);
    const result = await callOpenAI<DashboardInsightResponse>(
      systemPrompt,
      userPrompt,
    );
    if (result) {
      setInsight(result);
      await saveAIInteraction({
        id: uuidv4(),
        insightType: "dashboard_insight",
        summary: result.headline,
        response: result,
        rating: null,
        createdAt: new Date().toISOString(),
      });
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
        : "text-secondary";

  return (
    <AppShell>
      <div className="mx-auto w-full px-4 py-6 sm:px-6 sm:py-8 lg:w-4/5">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-[30px] font-bold tracking-tight text-gray-900">
              Dashboard
            </h1>
            <p className="mt-1.5 text-[15px] text-secondary">
              {sessions.length === 0
                ? "No sessions logged yet"
                : `${sessions.length} sessions`}
            </p>
          </div>
          <Button
            type="button"
            className="mt-1"
            onClick={handleGenerateInsight}
            disabled={loading || sessions.length === 0}
            aria-busy={loading}
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
            <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
              {STATS.map(({ label, value, delta, pos }) => (
                <div key={label} className="rounded-xl bg-white p-5">
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
                          : "text-secondary"
                    }`}
                  >
                    {delta}
                  </p>
                </div>
              ))}
            </div>

            {/* AI Coaching Brief */}
            <div aria-live="polite" aria-atomic="true">
              {/* AI Coaching Brief — error state */}
              {error && (
                <div className="mb-6 rounded-xl bg-white p-6">
                  <p className="text-[14px] text-secondary">
                    AI insights temporarily unavailable. Your data is safe.
                  </p>
                </div>
              )}

              {/* AI Coaching Brief — insight state */}
              {insight && !error && (
                <div className="mb-6 rounded-xl bg-white">
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_308px]">
                    {/* Left: insight + action */}
                    <div className="border-b border-black/5 p-6 lg:border-b-0 lg:border-r">
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
                        <p className="text-[14px] leading-relaxed text-gray-900">
                          {insight.actionLabel}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[13px] text-secondary">
                          Useful?
                        </span>
                        <button
                          type="button"
                          aria-label="Helpful"
                          disabled={feedbackGiven !== null}
                          onClick={() => {
                            saveAIFeedback({
                              insightType: "dashboard_insight",
                              timestamp: new Date().toISOString(),
                              rating: "helpful",
                            });
                            setFeedbackGiven("helpful");
                          }}
                          className={`flex h-11 w-11 items-center justify-center rounded-lg transition-all duration-150 sm:h-8 sm:w-8 ${
                            feedbackGiven === "helpful"
                              ? "bg-accent-soft text-accent"
                              : feedbackGiven !== null
                                ? "bg-gray-100 text-secondary opacity-50 cursor-not-allowed"
                                : "bg-gray-100 text-secondary hover:bg-gray-200"
                          }`}
                        >
                          <ThumbsUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          aria-label="Not helpful"
                          disabled={feedbackGiven !== null}
                          onClick={() => {
                            saveAIFeedback({
                              insightType: "dashboard_insight",
                              timestamp: new Date().toISOString(),
                              rating: "not_helpful",
                            });
                            setFeedbackGiven("not_helpful");
                          }}
                          className={`flex h-11 w-11 items-center justify-center rounded-lg transition-all duration-150 sm:h-8 sm:w-8 ${
                            feedbackGiven === "not_helpful"
                              ? "bg-danger/10 text-danger"
                              : feedbackGiven !== null
                                ? "bg-gray-100 text-secondary opacity-50 cursor-not-allowed"
                                : "bg-gray-100 text-secondary hover:bg-gray-200"
                          }`}
                        >
                          <ThumbsDown className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Right: Evidence */}
                    <div className="flex flex-col p-4">
                      <div className="flex-1 rounded-lg bg-gray-50 p-5">
                        <p className="mb-4 text-[13px] font-medium text-secondary">
                          Evidence
                        </p>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                          <div>
                            <p className="mb-1 text-[12px] text-secondary">
                              Accuracy
                            </p>
                            <p className="tabular-nums text-[26px] font-bold leading-none text-gray-900">
                              {insight.evidence.accuracy}%
                            </p>
                            <p
                              className={`mt-1 text-[12px] capitalize ${trendCls(insight.evidence.trend)}`}
                            >
                              {insight.evidence.trend}
                            </p>
                          </div>
                          <div>
                            <p className="mb-1 text-[12px] text-secondary">
                              Mistakes
                            </p>
                            <p className="tabular-nums text-[26px] font-bold leading-none text-gray-900">
                              {mistakeFreq.find(
                                (m) => m.topic === insight.evidence.topic,
                              )?.count ?? 0}
                            </p>
                          </div>
                          <div>
                            <p className="mb-1 text-[12px] text-secondary">
                              Sessions logged
                            </p>
                            <p className="tabular-nums text-[26px] font-bold leading-none text-gray-900">
                              {
                                sessions.filter(
                                  (s) => s.topic === insight.evidence.topic,
                                ).length
                              }
                            </p>
                          </div>
                          <div>
                            <p className="mb-1 text-[12px] text-secondary">
                              Priority topic
                            </p>
                            <TopicPill
                              topic={insight.evidence.topic as AMCTopic}
                            />
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
                </div>
              )}
            </div>
            {/* end aria-live */}

            {/* Topic Performance */}
            <div>
              <div className="mb-3 flex items-center justify-between px-1">
                <h2 className="text-[17px] font-semibold text-gray-900">
                  Topic Performance
                </h2>
                <span className="text-[13px] text-secondary">
                  {TOPICS.length} topics · sorted by accuracy
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {TOPICS.map((row) => (
                  <div key={row.topic} className="rounded-xl bg-white p-4">
                    <div className="mb-3">
                      <TopicPill topic={row.topic as AMCTopic} />
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <div>
                        <p className="text-[11px] font-medium text-secondary">
                          Accuracy
                        </p>
                        <div className="mt-0.5">
                          <AccBar acc={row.acc} />
                        </div>
                      </div>
                      <div>
                        <p className="text-[11px] font-medium text-secondary">
                          Trend
                        </p>
                        <div className="mt-0.5">
                          <TrendCell trend={row.trend} />
                        </div>
                      </div>
                      <div>
                        <p className="text-[11px] font-medium text-secondary">
                          Mistakes
                        </p>
                        <p className="mt-0.5 tabular-nums text-[18px] font-medium text-gray-900">
                          {row.mistakes}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-medium text-secondary">
                          Last studied
                        </p>
                        <p className="mt-0.5 text-[18px] font-medium text-secondary">
                          {row.lastStudied}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}

export default DashboardPage;
