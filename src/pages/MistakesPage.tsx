import { useState } from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, BookOpen, AlertTriangle, Sparkles, BarChart3 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import type { Mistake, AMCTopic } from "../types";
import { getMistakes, saveMistake } from "../services/storage";

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

function MistakesPage() {
  const [topic, setTopic] = useState<AMCTopic>("Cardiology");
  const [questionSummary, setQuestionSummary] = useState("");
  const [whyWrong, setWhyWrong] = useState("");
  const [correctConcept, setCorrectConcept] = useState("");

  // Load from storage on first render — survives page refresh
  const [mistakes, setMistakes] = useState<Mistake[]>(getMistakes);

  const handleSaveMistake = (e: React.FormEvent) => {
    e.preventDefault();

    if (!questionSummary || !whyWrong || !correctConcept) {
      alert("Please fill all required fields");
      return;
    }

    const newMistake: Mistake = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      topic,
      questionSummary,
      whyWrong,
      correctConcept,
    };

    saveMistake(newMistake);
    setMistakes(getMistakes());

    setQuestionSummary("");
    setWhyWrong("");
    setCorrectConcept("");
  };

  // Display-only derived values
  const uniqueTopics = new Set(mistakes.map((m) => m.topic)).size;

  // ── Design tokens ────────────────────────────────────────────────────────
  const inputCls =
    "w-full rounded-[8px] border border-black/[0.12] bg-white px-3 py-2 text-[13px] text-zinc-800 transition-all duration-150 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20";

  const labelCls = "mb-1.5 block text-[12px] font-medium text-secondary";

  return (
    <div className="fixed inset-0 z-50 flex overflow-hidden bg-zinc-50">

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside className="flex h-full w-60 shrink-0 flex-col border-r border-black/[0.07] bg-white">

        {/* Brand header */}
        <div className="flex items-center gap-2.5 px-5 py-5">
          <div className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded bg-accent text-[11px] font-medium text-white">
            AI
          </div>
          <span className="text-[14px] font-semibold text-zinc-900">AMC Coach</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 px-3 pt-1">

          {/* Dashboard */}
          <Link to="/" className="flex w-full items-center gap-3 rounded-[7px] px-3 py-2 text-[13.5px] font-medium text-secondary transition-colors duration-150 hover:text-zinc-900">
            <LayoutDashboard className="h-4 w-4 shrink-0" />
            Dashboard
          </Link>

          {/* Study Sessions */}
          <Link to="/study-sessions" className="flex w-full items-center gap-3 rounded-[7px] px-3 py-2 text-[13.5px] font-medium text-secondary transition-colors duration-150 hover:text-zinc-900">
            <BookOpen className="h-4 w-4 shrink-0" />
            Study Sessions
          </Link>

          {/* Mistakes — active */}
          <Link to="/mistakes" className="flex w-full items-center gap-3 rounded-[7px] bg-accent-soft px-3 py-2 text-[13.5px] font-medium text-accent transition-colors duration-150">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            Mistakes
          </Link>

          {/* AI Coach */}
          <Link to="/ai-coach" className="flex w-full items-center gap-3 rounded-[7px] px-3 py-2 text-[13.5px] font-medium text-secondary transition-colors duration-150 hover:text-zinc-900">
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
          <p className="mt-0.5 text-xs text-secondary">AMC MCQ Part 1</p>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1200px] px-9 py-9">

          {/* Page header */}
          <div className="mb-6">
            <h1 className="text-[20px] font-semibold tracking-[-0.02em] text-zinc-900">
              Mistakes
            </h1>
            <p className="mt-1 text-sm text-secondary">
              Every mistake logged is a pattern found.
            </p>
          </div>

          {/* ── Two-column grid ─────────────────────────────────────────── */}
          <div className="grid grid-cols-[400px_1fr] items-start gap-6">

            {/* Left: Log mistake form card */}
            <div className="rounded-[10px] border border-black/[0.07] bg-white p-6">
              <h2 className="mb-5 text-[13px] font-semibold text-zinc-900">Log mistake</h2>

              <form onSubmit={handleSaveMistake}>

                {/* Topic */}
                <div className="mb-4">
                  <label className={labelCls}>Topic</label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value as AMCTopic)}
                    className={`h-[38px] ${inputCls}`}
                  >
                    {AMC_TOPICS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Question summary */}
                <div className="mb-4">
                  <label className={labelCls}>Question summary</label>
                  <textarea
                    rows={3}
                    value={questionSummary}
                    onChange={(e) => setQuestionSummary(e.target.value)}
                    placeholder="Brief description of the question…"
                    className={`${inputCls} resize-none`}
                  />
                </div>

                {/* Why I got it wrong */}
                <div className="mb-4">
                  <label className={labelCls}>Why I got it wrong</label>
                  <textarea
                    rows={3}
                    value={whyWrong}
                    onChange={(e) => setWhyWrong(e.target.value)}
                    placeholder="What confused you or what did you miss…"
                    className={`${inputCls} resize-none`}
                  />
                </div>

                {/* Correct concept */}
                <div className="mb-6">
                  <label className={labelCls}>Correct concept</label>
                  <textarea
                    rows={3}
                    value={correctConcept}
                    onChange={(e) => setCorrectConcept(e.target.value)}
                    placeholder="The key fact or principle to remember…"
                    className={`${inputCls} resize-none`}
                  />
                </div>

                {/* Save button */}
                <button
                  type="submit"
                  className="rounded-[8px] bg-accent px-4 py-[9px] text-[13px] font-medium text-white transition-all duration-150 hover:bg-accent-hover active:scale-[0.98]"
                >
                  Save mistake
                </button>
              </form>
            </div>

            {/* Right: Mistakes table */}
            <div className="flex flex-col gap-3">

              {/* Count line above the table */}
              {mistakes.length > 0 && (
                <p className="font-mono text-[12px] tabular-nums text-tertiary">
                  {mistakes.length} {mistakes.length === 1 ? "mistake" : "mistakes"} · {uniqueTopics} {uniqueTopics === 1 ? "topic" : "topics"}
                </p>
              )}

              {/* Table card */}
              <div className="overflow-hidden rounded-[10px] border border-black/[0.07] bg-white">

                {mistakes.length === 0 ? (
                  <div className="flex items-center justify-center px-6 py-16 text-center">
                    <p className="text-sm text-secondary">
                      No mistakes logged yet — they'll appear here as patterns to learn from.
                    </p>
                  </div>
                ) : (
                  <table className="w-full table-fixed">
                    <colgroup>
                      <col className="w-[20%]" />
                      <col className="w-[22%]" />
                      <col className="w-[20%]" />
                      <col className="w-[22%]" />
                      <col className="w-[16%]" />
                    </colgroup>
                    <thead>
                      <tr className="border-b border-black/[0.07]">
                        {["Topic", "Question summary", "Why wrong", "Correct concept", "Date"].map((col) => (
                          <th
                            key={col}
                            className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.06em] text-tertiary"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {mistakes.map((mistake) => {
                        const date = new Date(mistake.createdAt).toLocaleDateString(
                          "en-AU",
                          { day: "2-digit", month: "short", year: "numeric" },
                        );
                        return (
                          <tr
                            key={mistake.id}
                            className="border-b border-black/[0.05] align-top last:border-0 transition-colors duration-150 hover:bg-zinc-50"
                          >
                            {/* Topic pill */}
                            <td className="overflow-hidden px-4 py-[14px]">
                              <span
                                title={mistake.topic}
                                className="inline-block max-w-full truncate rounded-full bg-accent-soft px-2.5 py-0.5 text-[12px] font-medium text-accent"
                              >
                                {mistake.topic}
                              </span>
                            </td>

                            {/* Question summary */}
                            <td className="px-4 py-[14px]">
                              <div className="line-clamp-2 text-[13px] leading-relaxed text-zinc-800">
                                {mistake.questionSummary}
                              </div>
                            </td>

                            {/* Why wrong — text-secondary */}
                            <td className="px-4 py-[14px]">
                              <div className="line-clamp-2 text-[13px] leading-relaxed text-secondary">
                                {mistake.whyWrong}
                              </div>
                            </td>

                            {/* Correct concept */}
                            <td className="px-4 py-[14px]">
                              <div className="line-clamp-2 text-[13px] leading-relaxed text-zinc-800">
                                {mistake.correctConcept}
                              </div>
                            </td>

                            {/* Date */}
                            <td className="px-4 py-[14px]">
                              <span className="whitespace-nowrap font-mono text-[12px] tabular-nums text-tertiary">
                                {date}
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
        </div>
      </main>

    </div>
  );
}

export default MistakesPage;
