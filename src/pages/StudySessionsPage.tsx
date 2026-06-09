import { useState } from "react";
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
  };

  const inputClass =
    "w-full rounded border border-[#E5E5E5] bg-white px-3 py-2 text-[13px] text-[#1C1C1E] focus:border-[#0D9488] focus:outline-none transition-colors";

  const labelClass = "mb-1.5 block text-[11px] font-medium uppercase tracking-widest text-[#9CA3AF]";

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: "#F7F6F3" }}>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold tracking-tight text-[#1C1C1E]">
          Study Sessions
        </h1>
        <p className="mt-0.5 text-sm text-[#9CA3AF]">
          Log your practice sessions to track performance over time.
        </p>
      </div>

      {/* ── Form card ──────────────────────────────────────────────── */}
      <div
        className="mb-6 rounded-lg border border-[#E5E5E5] bg-white p-6"
        style={{ maxWidth: "640px" }}
      >
        <h2 className="mb-5 text-[11px] font-semibold uppercase tracking-widest text-[#374151]">
          Add Session
        </h2>

        <form onSubmit={handleSave}>
          {/* Topic */}
          <div className="mb-4">
            <label className={labelClass}>Topic</label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value as AMCTopic)}
              className={inputClass}
            >
              {AMC_TOPICS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Attempted / Correct / Incorrect — three columns */}
          <div className="mb-4 grid grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Attempted</label>
              <input
                type="number"
                value={attempted}
                onChange={(e) => setAttempted(e.target.value)}
                className={`${inputClass} font-mono`}
                placeholder="0"
              />
            </div>
            <div>
              <label className={labelClass}>Correct</label>
              <input
                type="number"
                value={correct}
                onChange={(e) => setCorrect(e.target.value)}
                className={`${inputClass} font-mono`}
                placeholder="0"
              />
            </div>
            <div>
              <label className={labelClass}>Incorrect</label>
              <input
                type="number"
                value={incorrect}
                onChange={(e) => setIncorrect(e.target.value)}
                className={`${inputClass} font-mono`}
                placeholder="0"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="mb-5">
            <label className={labelClass}>Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes about this session…"
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Save */}
          <button
            type="submit"
            className="rounded px-5 py-2 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#0D9488" }}
          >
            Save Session
          </button>
        </form>
      </div>

      {/* ── Sessions table ─────────────────────────────────────────── */}
      {sessions.length === 0 ? (
        <div className="rounded-lg border border-[#E5E5E5] bg-white p-10 text-center">
          <p className="text-sm text-[#9CA3AF]">
            No sessions logged yet. Add your first session above.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-[#E5E5E5] bg-white overflow-hidden">
          {/* Table header bar */}
          <div className="border-b border-[#E5E5E5] px-6 py-4">
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-[#374151]">
              Past Sessions
            </h2>
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E5E5]">
                {["Topic", "Date", "Attempted", "Correct", "Accuracy"].map(
                  (col) => (
                    <th
                      key={col}
                      className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-[#9CA3AF]"
                    >
                      {col}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {sessions.map((session, i) => {
                const accuracy = Math.round(
                  (session.correct / session.attempted) * 100,
                );
                const date = new Date(session.createdAt).toLocaleDateString(
                  "en-AU",
                  { day: "2-digit", month: "short", year: "numeric" },
                );
                const accuracyColor =
                  accuracy < 50
                    ? "text-red-500"
                    : accuracy < 70
                      ? "text-amber-500"
                      : "text-[#0D9488]";

                return (
                  <tr
                    key={session.id}
                    className="border-b border-[#E5E5E5] last:border-0"
                    style={{ backgroundColor: i % 2 === 0 ? "#FFFFFF" : "#FAFAFA" }}
                  >
                    <td className="px-6 py-3.5 text-[13px] text-[#374151]">
                      {session.topic}
                    </td>
                    <td className="px-6 py-3.5 text-[13px] text-[#9CA3AF]">
                      {date}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-[13px] text-[#1C1C1E]">
                      {session.attempted}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-[13px] text-[#1C1C1E]">
                      {session.correct}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`font-mono text-[13px] ${accuracyColor}`}>
                        {accuracy}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default StudySessionsPage;
