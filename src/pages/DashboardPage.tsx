import { Link } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, AlertTriangle, Sparkles, BarChart3,
  Lightbulb, ThumbsUp, ThumbsDown, BarChart2, Calendar, Activity,
  ChevronRight,
} from "lucide-react";

function DashboardPage() {
  return (
    <div className="fixed inset-0 z-50 flex overflow-hidden bg-zinc-50">

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside className="flex h-full w-60 shrink-0 flex-col border-r border-black/[0.07] bg-white">

        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-indigo-600 text-xs font-bold text-white">
            A
          </div>
          <span className="text-sm font-semibold text-zinc-900">AMC Coach</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 px-3 pt-1">

          {/* Dashboard — active */}
          <Link to="/" className="flex w-full items-center gap-3 rounded-lg bg-indigo-50 px-3 py-2 text-left text-sm font-medium text-indigo-600 transition-all duration-150">
            <LayoutDashboard className="h-4 w-4 shrink-0" />
            Dashboard
          </Link>

          {/* Study Sessions */}
          <Link to="/study-sessions" className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-zinc-500 transition-all duration-150 hover:text-zinc-900">
            <BookOpen className="h-4 w-4 shrink-0" />
            Study Sessions
          </Link>

          {/* Mistakes */}
          <Link to="/mistakes" className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-zinc-500 transition-all duration-150 hover:text-zinc-900">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            Mistakes
          </Link>

          {/* AI Coach */}
          <Link to="/ai-coach" className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-zinc-500 transition-all duration-150 hover:text-zinc-900">
            <Sparkles className="h-4 w-4 shrink-0" />
            AI Coach
          </Link>

          {/* Progress — no route yet, renders as a disabled-looking link */}
          <span className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 cursor-not-allowed select-none">
            <BarChart3 className="h-4 w-4 shrink-0" />
            Progress
          </span>
        </nav>

        {/* Bottom: user identity */}
        <div className="mt-auto border-t border-black/[0.07] px-5 py-4">
          <p className="text-sm font-semibold text-zinc-900">Dr. Priya</p>
          <p className="mt-0.5 text-xs text-zinc-500">AMC MCQ Part 1</p>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1100px] px-9 py-9">

          {/* Page header */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-zinc-900">Dashboard</h1>
              <p className="mt-0.5 text-sm text-zinc-500">24 sessions · last activity 2 days ago</p>
            </div>
            <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-all duration-150 hover:bg-indigo-700">
              Generate insight
            </button>
          </div>

          {/* ── Section 1: AI Insight card ───────────────────────────────── */}
          <div className="mb-6 rounded-xl border border-black/[0.07] bg-white p-6 transition-all duration-150 hover:border-black/[0.12]">
            <div className="grid grid-cols-2 gap-8">

              {/* Left: insight text */}
              <div className="flex flex-col">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-indigo-600">
                  AI INSIGHT
                </p>
                <h2 className="mb-2 text-lg font-semibold text-zinc-900">
                  Cardiology is your highest-priority gap
                </h2>
                <p className="mb-4 text-sm leading-relaxed text-zinc-500">
                  Based on your last 14 days of study, Cardiology shows the steepest performance gap. Your accuracy sits at 52%, which is 16 percentage points below your overall average. We recommend prioritising ECG interpretation and arrhythmia classification this week.
                </p>

                {/* Key Takeaway */}
                <div className="mb-4 rounded-lg bg-zinc-50 p-4">
                  <div className="mb-1.5 flex items-center gap-2">
                    <Lightbulb className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
                    <span className="text-xs font-semibold text-zinc-700">Key Takeaway</span>
                  </div>
                  <p className="text-sm text-zinc-600">
                    Focus on SVT vs AFib differentiation in your next 3 practice sets.
                  </p>
                </div>

                {/* Feedback */}
                <div className="mt-auto flex items-center gap-3">
                  <span className="text-xs text-zinc-400">Was this insight helpful?</span>
                  <button className="rounded p-1.5 text-zinc-400 transition-all duration-150 hover:bg-zinc-100 hover:text-zinc-600">
                    <ThumbsUp className="h-4 w-4" />
                  </button>
                  <button className="rounded p-1.5 text-zinc-400 transition-all duration-150 hover:bg-zinc-100 hover:text-zinc-600">
                    <ThumbsDown className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Right: evidence cards */}
              <div className="flex flex-col">
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">EVIDENCE</span>
                  <span className="text-xs text-zinc-400">(computed from your data)</span>
                </div>

                <div className="grid grid-cols-2 gap-3">

                  {/* Card: 52% accuracy */}
                  <div className="rounded-xl border border-black/[0.07] bg-zinc-50 p-4 transition-all duration-150 hover:border-black/[0.12]">
                    <BarChart2 className="mb-2 h-4 w-4 text-zinc-400" />
                    <p className="font-mono text-2xl font-medium tabular-nums text-zinc-900">52%</p>
                    <p className="mt-0.5 text-xs text-zinc-500">Accuracy in Cardiology</p>
                    <p className="mt-0.5 font-mono text-xs tabular-nums text-red-500">↓ 9% vs last 7 sessions</p>
                  </div>

                  {/* Card: 12 mistakes */}
                  <div className="rounded-xl border border-black/[0.07] bg-zinc-50 p-4 transition-all duration-150 hover:border-black/[0.12]">
                    <AlertTriangle className="mb-2 h-4 w-4 text-zinc-400" />
                    <p className="font-mono text-2xl font-medium tabular-nums text-zinc-900">12</p>
                    <p className="mt-0.5 text-xs text-zinc-500">Mistakes Logged</p>
                    <p className="mt-0.5 font-mono text-xs tabular-nums text-amber-500">↑ 4 vs last 7 sessions</p>
                  </div>

                  {/* Card: 6 sessions */}
                  <div className="rounded-xl border border-black/[0.07] bg-zinc-50 p-4 transition-all duration-150 hover:border-black/[0.12]">
                    <Calendar className="mb-2 h-4 w-4 text-zinc-400" />
                    <p className="font-mono text-2xl font-medium tabular-nums text-zinc-900">6</p>
                    <p className="mt-0.5 text-xs text-zinc-500">Sessions Analysed</p>
                    <p className="mt-0.5 font-mono text-xs tabular-nums text-zinc-400">Last 14 days</p>
                  </div>

                  {/* Card: ECG error pattern */}
                  <div className="rounded-xl border border-black/[0.07] bg-zinc-50 p-4 transition-all duration-150 hover:border-black/[0.12]">
                    <Activity className="mb-2 h-4 w-4 text-zinc-400" />
                    <p className="font-mono text-2xl font-medium tabular-nums text-zinc-900">ECG</p>
                    <p className="mt-0.5 text-xs text-zinc-500">Top Error Pattern</p>
                    <p className="mt-0.5 font-mono text-xs tabular-nums text-zinc-400">SVT vs AFib</p>
                  </div>
                </div>

                <p className="mt-3 text-right font-mono text-xs text-zinc-400">Confidence: High</p>
              </div>
            </div>
          </div>

          {/* ── Section 2: Stats + Weak Topics ──────────────────────────── */}
          <div className="grid grid-cols-2 gap-4">

            {/* Left: 2×2 stat boxes */}
            <div className="grid grid-cols-2 gap-4">

              {/* Average Accuracy */}
              <div className="rounded-xl border border-black/[0.07] bg-white p-5 transition-all duration-150 hover:border-black/[0.12]">
                <p className="mb-2 text-xs text-zinc-500">Average Accuracy</p>
                <p className="font-mono text-2xl font-medium tabular-nums text-zinc-900">68%</p>
                <p className="mt-1 font-mono text-xs tabular-nums text-green-600">+4% vs last week</p>
              </div>

              {/* Questions Attempted */}
              <div className="rounded-xl border border-black/[0.07] bg-white p-5 transition-all duration-150 hover:border-black/[0.12]">
                <p className="mb-2 text-xs text-zinc-500">Questions Attempted</p>
                <p className="font-mono text-2xl font-medium tabular-nums text-zinc-900">612</p>
                <p className="mt-1 font-mono text-xs tabular-nums text-green-600">+96 this week</p>
              </div>

              {/* Mistakes Logged */}
              <div className="rounded-xl border border-black/[0.07] bg-white p-5 transition-all duration-150 hover:border-black/[0.12]">
                <p className="mb-2 text-xs text-zinc-500">Mistakes Logged</p>
                <p className="font-mono text-2xl font-medium tabular-nums text-zinc-900">47</p>
                <p className="mt-1 font-mono text-xs tabular-nums text-zinc-400">12 unreviewed</p>
              </div>

              {/* Weakest Topic — Inter, not mono, for the value */}
              <div className="rounded-xl border border-black/[0.07] bg-white p-5 transition-all duration-150 hover:border-black/[0.12]">
                <p className="mb-2 text-xs text-zinc-500">Weakest Topic</p>
                <p className="text-2xl font-medium text-zinc-900">Cardiology</p>
                <p className="mt-1 font-mono text-xs tabular-nums text-red-500">52% · declining</p>
              </div>
            </div>

            {/* Right: Weak Topics table */}
            <div className="overflow-hidden rounded-xl border border-black/[0.07] bg-white">

              {/* Header */}
              <div className="grid grid-cols-[1fr_148px_72px_64px_20px] border-b border-black/[0.07] px-5 py-3">
                <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">Topic</span>
                <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">Accuracy</span>
                <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">Trend</span>
                <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">Mistakes</span>
                <span />
              </div>

              {/* Rows */}
              {(
                [
                  { topic: "Cardiology",          acc: 52, trend: "↓ 9%", trendCls: "text-red-500",   mistakes: 12, barCls: "bg-red-400"   },
                  { topic: "Pharmacology",         acc: 58, trend: "— 0%", trendCls: "text-zinc-400",  mistakes: 9,  barCls: "bg-red-400"   },
                  { topic: "Neurology",            acc: 61, trend: "↑ 5%", trendCls: "text-green-600", mistakes: 7,  barCls: "bg-amber-400" },
                  { topic: "Endocrinology",        acc: 64, trend: "↓ 3%", trendCls: "text-red-500",   mistakes: 8,  barCls: "bg-amber-400" },
                  { topic: "Respiratory Medicine", acc: 71, trend: "↑ 6%", trendCls: "text-green-600", mistakes: 4,  barCls: "bg-green-500" },
                ] as const
              ).map((row) => (
                <div
                  key={row.topic}
                  className="grid grid-cols-[1fr_148px_72px_64px_20px] cursor-pointer items-center border-b border-black/[0.07] px-5 py-3.5 last:border-0 transition-all duration-150 hover:bg-zinc-50"
                >
                  <span className="text-sm font-medium text-zinc-900">{row.topic}</span>

                  {/* Accuracy: bar track + percentage */}
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-16 shrink-0 overflow-hidden rounded-full bg-zinc-100">
                      <div
                        className={`h-full rounded-full ${row.barCls} ${
                          row.acc === 52 ? "w-[52%]"
                          : row.acc === 58 ? "w-[58%]"
                          : row.acc === 61 ? "w-[61%]"
                          : row.acc === 64 ? "w-[64%]"
                          : "w-[71%]"
                        }`}
                      />
                    </div>
                    <span className="font-mono text-sm tabular-nums text-zinc-900">{row.acc}%</span>
                  </div>

                  <span className={`font-mono text-xs tabular-nums ${row.trendCls}`}>{row.trend}</span>
                  <span className="font-mono text-sm tabular-nums text-zinc-900">{row.mistakes}</span>

                  {/* Chevron */}
                  <ChevronRight className="h-4 w-4 text-zinc-300" />
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

    </div>
  );
}

export default DashboardPage;
