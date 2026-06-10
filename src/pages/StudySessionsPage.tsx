import { useState } from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, BookOpen, AlertTriangle, Sparkles, BarChart3 } from "lucide-react";
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
            <LayoutDashboard className="h-4 w-4 shrink-0" />
            Dashboard
          </Link>

          {/* Study Sessions — active */}
          <Link to="/study-sessions" className="flex w-full items-center gap-3 rounded-[7px] bg-[#EEF2FF] px-3 py-2 text-left text-[13.5px] font-medium text-[#4F46E5] transition-colors duration-150">
            <BookOpen className="h-4 w-4 shrink-0" />
            Study Sessions
          </Link>

          {/* Mistakes */}
          <Link to="/mistakes" className="flex w-full items-center gap-3 rounded-[7px] px-3 py-2 text-left text-[13.5px] font-medium text-[#71717A] transition-colors duration-150 hover:text-zinc-900">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            Mistakes
          </Link>

          {/* AI Coach */}
          <Link to="/ai-coach" className="flex w-full items-center gap-3 rounded-[7px] px-3 py-2 text-left text-[13.5px] font-medium text-[#71717A] transition-colors duration-150 hover:text-zinc-900">
            <Sparkles className="h-4 w-4 shrink-0" />
            AI Coach
          </Link>

          {/* Progress — no route yet */}
          <span className="flex w-full cursor-not-allowed select-none items-center gap-3 rounded-[7px] px-3 py-2 text-[13.5px] font-medium text-zinc-300">
            <BarChart3 className="h-4 w-4 shrink-0" />
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
