import { useState } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import type { StudySession, AMCTopic } from "../types";
import { getSessions, saveSession } from "../services/storage";

// AMC topic list — drives the dropdown. Single source of truth.
const AMC_TOPICS: AMCTopic[] = [
  "Cardiology",
  "Respiratory Medicine",
  "Gastroenterology",
  "Neurology",
  "Obstetrics & Gynaecology",
  "Paediatrics",
  "Psychiatry",
  "Surgery",
  "Pharmacology",
  "Endocrinology",
  "Infectious Diseases",
  "Renal Medicine",
  "Musculoskeletal",
  "Dermatology",
  "Haematology",
];

function StudySessionsPage() {
  const [topic, setTopic] = useState<AMCTopic>("Cardiology");
  const [attempted, setAttempted] = useState("");
  const [correct, setCorrect] = useState("");
  const [incorrect, setIncorrect] = useState("");
  const [notes, setNotes] = useState("");

  // Load from storage, not local state — survives page refresh
  const [sessions, setSessions] = useState<StudySession[]>(getSessions);

  // Cosmetic only: which row to animate on first render after save
  const [highlightId, setHighlightId] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (Number(correct) + Number(incorrect) !== Number(attempted)) {
      alert("Correct + Incorrect must equal Attempted");
      return;
    }

    const newSession: StudySession = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      topic,
      attempted: Number(attempted),
      correct: Number(correct),
      incorrect: Number(incorrect),
      notes,
    };

    saveSession(newSession);
    setSessions(getSessions());

    setAttempted("");
    setCorrect("");
    setIncorrect("");
    setNotes("");

    setHighlightId(newSession.id);
    setTimeout(() => setHighlightId(null), 900);
  };

  // ── Design tokens ────────────────────────────────────────────────────────
  const inputCls =
    "h-[38px] w-full rounded-[8px] border border-black/[0.12] bg-white px-3 text-[13px] text-zinc-800 transition-all duration-150 focus:border-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20";

  const monoInputCls =
    "h-[38px] w-full rounded-[8px] border border-black/[0.12] bg-white px-3 font-mono tabular-nums text-[13px] text-zinc-800 transition-all duration-150 focus:border-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20";

  const labelCls = "mb-1.5 block text-[12px] font-medium text-[#71717A]";

  return (
    <div className="fixed inset-0 z-50 flex overflow-hidden bg-zinc-50">

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside className="flex h-full w-60 shrink-0 flex-col border-r border-black/[0.07] bg-white">

        {/* Brand header */}
        <div className="flex items-center gap-2.5 px-5 py-5">
          <div className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded bg-[#4F46E5] text-[11px] font-medium text-white">
            AI
          </div>
          <span className="text-[14px] font-semibold text-zinc-900">AMC Coach</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 px-3 pt-1">

          {/* Dashboard */}
          <Link to="/" className="flex w-full items-center gap-3 rounded-[7px] px-3 py-2 text-left text-[13.5px] font-medium text-[#71717A] transition-colors duration-150 hover:text-zinc-900">
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
            Dashboard
          </Link>

          {/* Study Sessions — active */}
          <Link to="/study-sessions" className="flex w-full items-center gap-3 rounded-[7px] bg-[#EEF2FF] px-3 py-2 text-left text-[13.5px] font-medium text-[#4F46E5] transition-colors duration-150">
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            Study Sessions
          </Link>

          {/* Mistakes */}
          <Link to="/mistakes" className="flex w-full items-center gap-3 rounded-[7px] px-3 py-2 text-left text-[13.5px] font-medium text-[#71717A] transition-colors duration-150 hover:text-zinc-900">
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            Mistakes
          </Link>

          {/* AI Coach */}
          <Link to="/ai-coach" className="flex w-full items-center gap-3 rounded-[7px] px-3 py-2 text-left text-[13.5px] font-medium text-[#71717A] transition-colors duration-150 hover:text-zinc-900">
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
            </svg>
            AI Coach
          </Link>

          {/* Progress — no route yet */}
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
          <p className="mt-0.5 text-xs text-[#71717A]">AMC MCQ Part 1</p>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1100px] px-9 py-9">

          {/* Page header */}
          <div className="mb-6">
            <h1 className="text-[20px] font-semibold tracking-[-0.02em] text-zinc-900">
              Study sessions
            </h1>
            <p className="mt-1 text-sm text-[#71717A]">
              Log your practice sessions to track performance over time.
            </p>
          </div>

          {/* ── Two-column grid ─────────────────────────────────────────── */}
          <div className="grid grid-cols-[400px_1fr] items-start gap-6">

            {/* Left: Add session form card */}
            <div className="rounded-[10px] border border-black/[0.07] bg-white p-6">
              <h2 className="mb-5 text-[13px] font-semibold text-zinc-900">Add session</h2>

              <form onSubmit={handleSave}>

                {/* Topic */}
                <div className="mb-4">
                  <label className={labelCls}>Topic</label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value as AMCTopic)}
                    className={inputCls}
                  >
                    {AMC_TOPICS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Attempted / Correct / Incorrect — 3-column row */}
                <div className="mb-4 grid grid-cols-3 gap-3">
                  <div>
                    <label className={labelCls}>Attempted</label>
                    <input
                      type="number"
                      value={attempted}
                      onChange={(e) => setAttempted(e.target.value)}
                      className={monoInputCls}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Correct</label>
                    <input
                      type="number"
                      value={correct}
                      onChange={(e) => setCorrect(e.target.value)}
                      className={monoInputCls}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Incorrect</label>
                    <input
                      type="number"
                      value={incorrect}
                      onChange={(e) => setIncorrect(e.target.value)}
                      className={monoInputCls}
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className="mb-6">
                  <label className={labelCls}>Notes</label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Optional notes about this session…"
                    className="w-full resize-none rounded-[8px] border border-black/[0.12] bg-white px-3 py-2 text-[13px] text-zinc-800 transition-all duration-150 focus:border-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
                  />
                </div>

                {/* Save button */}
                <button
                  type="submit"
                  className="rounded-[8px] bg-[#4F46E5] px-4 py-[9px] text-[13px] font-medium text-white transition-all duration-150 hover:bg-[#4338CA] active:scale-[0.98]"
                >
                  Save session
                </button>
              </form>
            </div>

            {/* Right: Past sessions table */}
            <div className="overflow-hidden rounded-[10px] border border-black/[0.07] bg-white">

              {sessions.length === 0 ? (
                <div className="flex items-center justify-center py-16 px-6 text-center">
                  <p className="text-sm text-[#71717A]">
                    No sessions logged yet — your history will appear here.
                  </p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-black/[0.07]">
                      {["Topic", "Date", "Attempted", "Correct", "Accuracy"].map((col) => (
                        <th
                          key={col}
                          className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-400"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((session) => {
                      const accuracy = Math.round(
                        (session.correct / session.attempted) * 100,
                      );
                      const date = new Date(session.createdAt).toLocaleDateString(
                        "en-AU",
                        { day: "2-digit", month: "short", year: "numeric" },
                      );
                      const accuracyColor =
                        accuracy < 55
                          ? "text-[#DC2626]"
                          : accuracy <= 65
                            ? "text-[#D97706]"
                            : "text-[#059669]";

                      return (
                        <tr
                          key={session.id}
                          className={`border-b border-black/[0.05] last:border-0 transition-colors duration-150 hover:bg-zinc-50 ${
                            session.id === highlightId ? "animate-row-highlight" : ""
                          }`}
                        >
                          <td className="px-5 py-[14px] text-[13.5px] text-zinc-800">
                            {session.topic}
                          </td>
                          <td className="px-5 py-[14px] text-[13.5px] text-[#71717A]">
                            {date}
                          </td>
                          <td className="px-5 py-[14px] font-mono tabular-nums text-[13.5px] text-zinc-800">
                            {session.attempted}
                          </td>
                          <td className="px-5 py-[14px] font-mono tabular-nums text-[13.5px] text-zinc-800">
                            {session.correct}
                          </td>
                          <td className="px-5 py-[14px]">
                            <span className={`font-mono tabular-nums text-[13.5px] ${accuracyColor}`}>
                              {accuracy}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

          </div>
        </div>
      </main>

    </div>
  );
}

export default StudySessionsPage;
