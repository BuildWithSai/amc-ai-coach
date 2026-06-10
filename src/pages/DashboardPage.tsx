import { Link } from "react-router-dom";

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
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
            Dashboard
          </Link>

          {/* Study Sessions */}
          <Link to="/study-sessions" className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-zinc-500 transition-all duration-150 hover:text-zinc-900">
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            Study Sessions
          </Link>

          {/* Mistakes */}
          <Link to="/mistakes" className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-zinc-500 transition-all duration-150 hover:text-zinc-900">
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            Mistakes
          </Link>

          {/* AI Coach */}
          <Link to="/ai-coach" className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-zinc-500 transition-all duration-150 hover:text-zinc-900">
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
            </svg>
            AI Coach
          </Link>

          {/* Progress — no route yet, renders as a disabled-looking link */}
          <span className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 cursor-not-allowed select-none">
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
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
                    <svg className="h-3.5 w-3.5 shrink-0 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.355a3.375 3.375 0 01-3 0m3 0a3.375 3.375 0 00-3 0m0 0V18m0-5.25a6.01 6.01 0 00-1.5-.189M12 12.75a6.01 6.01 0 001.5-.189M12 12.75A6 6 0 106 6.75a6 6 0 006 6z" />
                    </svg>
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
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                    </svg>
                  </button>
                  <button className="rounded p-1.5 text-zinc-400 transition-all duration-150 hover:bg-zinc-100 hover:text-zinc-600">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.861-2.4c.498-.634 1.226-1.08 2.032-1.08h.384" />
                    </svg>
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
                    <svg className="mb-2 h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                    </svg>
                    <p className="font-mono text-2xl font-medium tabular-nums text-zinc-900">52%</p>
                    <p className="mt-0.5 text-xs text-zinc-500">Accuracy in Cardiology</p>
                    <p className="mt-0.5 font-mono text-xs tabular-nums text-red-500">↓ 9% vs last 7 sessions</p>
                  </div>

                  {/* Card: 12 mistakes */}
                  <div className="rounded-xl border border-black/[0.07] bg-zinc-50 p-4 transition-all duration-150 hover:border-black/[0.12]">
                    <svg className="mb-2 h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    <p className="font-mono text-2xl font-medium tabular-nums text-zinc-900">12</p>
                    <p className="mt-0.5 text-xs text-zinc-500">Mistakes Logged</p>
                    <p className="mt-0.5 font-mono text-xs tabular-nums text-amber-500">↑ 4 vs last 7 sessions</p>
                  </div>

                  {/* Card: 6 sessions */}
                  <div className="rounded-xl border border-black/[0.07] bg-zinc-50 p-4 transition-all duration-150 hover:border-black/[0.12]">
                    <svg className="mb-2 h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                    <p className="font-mono text-2xl font-medium tabular-nums text-zinc-900">6</p>
                    <p className="mt-0.5 text-xs text-zinc-500">Sessions Analysed</p>
                    <p className="mt-0.5 font-mono text-xs tabular-nums text-zinc-400">Last 14 days</p>
                  </div>

                  {/* Card: ECG error pattern */}
                  <div className="rounded-xl border border-black/[0.07] bg-zinc-50 p-4 transition-all duration-150 hover:border-black/[0.12]">
                    <svg className="mb-2 h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h1.5a.75.75 0 01.75.75v.75m0 0h1.5m-1.5 0v4.5m0-4.5h3l1.5-4.5 3 9 1.5-4.5H21" />
                    </svg>
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
                  <svg className="h-4 w-4 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
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
