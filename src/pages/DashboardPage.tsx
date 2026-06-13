import {
  AlertTriangle,
  Activity,
  TrendingDown,
  TrendingUp,
  Minus,
  Lightbulb,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import type { ElementType } from "react";
import { AppShell } from "../components/AppShell";
import { Button } from "../components/Button";

type StatItem = { label: string; value: string; delta: string; pos: boolean | null };
type TopicRow = { topic: string; acc: number; trend: number; mistakes: number; lastStudied: string };
type EvidenceItem = { icon: ElementType; label: string; value: string; sub: string; cls: string };

const STATS: StatItem[] = [
  { label: "Avg accuracy", value: "68%", delta: "+4% vs last week", pos: true },
  { label: "Questions attempted", value: "612", delta: "+96 this week", pos: true },
  { label: "Mistakes logged", value: "47", delta: "12 unreviewed", pos: null },
  { label: "Study sessions", value: "24", delta: "last 30 days", pos: null },
];

const TOPICS: TopicRow[] = [
  { topic: "Cardiology", acc: 52, trend: -9, mistakes: 12, lastStudied: "2d ago" },
  { topic: "Pharmacology", acc: 58, trend: 0, mistakes: 9, lastStudied: "1d ago" },
  { topic: "Neurology", acc: 61, trend: 5, mistakes: 7, lastStudied: "3d ago" },
  { topic: "Endocrinology", acc: 64, trend: -3, mistakes: 8, lastStudied: "4d ago" },
  { topic: "Respiratory Medicine", acc: 71, trend: 6, mistakes: 4, lastStudied: "5d ago" },
];

const EVIDENCE: EvidenceItem[] = [
  { icon: Activity,       label: "Accuracy",    value: "52%", sub: "↓ 9% last 7 sessions", cls: "text-danger" },
  { icon: AlertTriangle,  label: "Mistakes",    value: "12",  sub: "↑ 4 last 7 sessions",  cls: "text-warning" },
  { icon: Activity,       label: "Sessions",    value: "6",   sub: "Last 14 days",          cls: "text-tertiary" },
  { icon: Activity,       label: "Top pattern", value: "ECG", sub: "SVT vs AFib",           cls: "text-tertiary" },
];

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
        <TrendingUp className="h-3.5 w-3.5 shrink-0" />
        +{trend}%
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
  return (
    <AppShell>
      <div className="mx-auto w-4/5 px-6 py-8">

        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-[30px] font-bold tracking-tight text-gray-900">Dashboard</h1>
            <p className="mt-1.5 text-[15px] text-secondary">24 sessions · last activity 2 days ago</p>
          </div>
          <Button type="button" className="mt-1">Generate insight</Button>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-4 gap-4">
          {STATS.map(({ label, value, delta, pos }) => (
            <div key={label} className="rounded-xl border border-black/10 bg-white p-5">
              <p className="mb-2 text-[13px] text-secondary">{label}</p>
              <p className="tabular-nums text-[26px] font-bold leading-none text-gray-900">{value}</p>
              <p
                className={`mt-2 tabular-nums text-[13px] ${
                  pos === true ? "text-success" : pos === false ? "text-danger" : "text-tertiary"
                }`}
              >
                {delta}
              </p>
            </div>
          ))}
        </div>

        {/* AI Coaching Brief */}
        <div className="mb-6 rounded-xl border border-black/10 bg-white">
          <div className="grid grid-cols-[1fr_308px]">

            {/* Left: insight + action */}
            <div className="border-r border-black/5 p-6">
              <h2 className="mb-3 text-[20px] font-semibold leading-snug text-balance text-gray-900">
                Cardiology is your highest-priority gap
              </h2>
              <p className="mb-5 max-w-[54ch] text-[15px] leading-relaxed text-secondary">
                Your accuracy in Cardiology sits at 52% — 16 points below your overall average. The error
                pattern concentrates in ECG interpretation and arrhythmia classification. Performance has
                dropped 9% across the last 7 sessions.
              </p>

              <div className="mb-6 rounded-xl bg-accent-soft p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 shrink-0 text-accent" />
                  <span className="text-[13px] font-semibold text-accent">Recommended action</span>
                </div>
                <p className="text-[14px] leading-relaxed text-gray-800">
                  In your next 3 practice sets, target SVT vs AFib differentiation. Aim for ≥65% before
                  advancing to rate control management.
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
              <p className="mb-4 text-[13px] font-medium text-secondary">Evidence</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                {EVIDENCE.map(({ label, value, sub, cls }) => (
                  <div key={label}>
                    <p className="tabular-nums text-[26px] font-bold leading-none text-gray-900">{value}</p>
                    <p className="mt-2 text-[13px] text-secondary">{label}</p>
                    <p className={`mt-1 tabular-nums text-[12px] ${cls}`}>{sub}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-right tabular-nums text-[12px] text-tertiary">Confidence: High</p>
            </div>
          </div>
        </div>

        {/* Topic Performance */}
        <div className="overflow-hidden rounded-xl border border-black/10 bg-white">
          <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
            <h2 className="text-[17px] font-semibold text-gray-900">Topic Performance</h2>
            <span className="text-[13px] text-secondary">5 topics · sorted by accuracy</span>
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b border-black/5">
                {(["Topic", "Accuracy", "Trend", "Mistakes", "Last studied"] as const).map((h) => (
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
                  <td className="px-6 py-3.5 text-[14px] font-medium text-gray-900">{row.topic}</td>
                  <td className="px-6 py-3.5"><AccBar acc={row.acc} /></td>
                  <td className="px-6 py-3.5"><TrendCell trend={row.trend} /></td>
                  <td className="px-6 py-3.5 tabular-nums text-[14px] text-gray-900">{row.mistakes}</td>
                  <td className="px-6 py-3.5 text-[13px] text-secondary">{row.lastStudied}</td>
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
