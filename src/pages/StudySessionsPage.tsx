import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import type { StudySession, AMCTopic } from "../types";
import { getSessions, saveSession } from "../services/storage";
import { AppShell } from "../components/AppShell";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { SectionTitle } from "../components/SectionTitle";

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

const inputCls =
  "h-[38px] w-full rounded-lg border border-black/10 bg-white px-3 text-[14px] text-gray-900 transition-all duration-150 placeholder:text-tertiary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20";

const monoInputCls =
  "h-[38px] w-full rounded-lg border border-black/10 bg-white px-3 tabular-nums text-[14px] text-gray-900 transition-all duration-150 placeholder:text-tertiary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20";

const labelCls = "mb-1.5 block text-[13px] font-medium text-secondary";

function StudySessionsPage() {
  const [topic, setTopic] = useState<AMCTopic>("Cardiology");
  const [attempted, setAttempted] = useState("");
  const [correct, setCorrect] = useState("");
  const [incorrect, setIncorrect] = useState("");
  const [notes, setNotes] = useState("");
  const [sessions, setSessions] = useState<StudySession[]>(getSessions);
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

  return (
    <AppShell>
      <div className="mx-auto w-4/5 px-6 py-8">

        <SectionTitle
          title="Study Sessions"
          subtitle="Log your practice sessions to track performance over time."
        />

        <div className="grid grid-cols-[380px_1fr] items-start gap-6">

          {/* Form card */}
          <Card padding>
            <h2 className="mb-5 text-[15px] font-semibold text-gray-900">Add session</h2>

            <form onSubmit={handleSave}>
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

              <div className="mb-6">
                <label className={labelCls}>Notes</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional notes about this session…"
                  className="w-full resize-none rounded-lg border border-black/10 bg-white px-3 py-2 text-[14px] text-gray-900 transition-all duration-150 placeholder:text-tertiary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
              </div>

              <Button type="submit">Save session</Button>
            </form>
          </Card>

          {/* Table card */}
          <Card overflow>
            {sessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <p className="text-[15px] font-semibold text-gray-900">No sessions logged yet</p>
                <p className="mt-1.5 max-w-[240px] text-[14px] text-secondary">
                  Your history will appear here.
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-black/10">
                    {["Topic", "Date", "Attempted", "Correct", "Accuracy"].map((col) => (
                      <th
                        key={col}
                        className="px-5 py-3 text-left text-[12px] font-medium uppercase tracking-[0.06em] text-secondary"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {sessions.map((session) => {
                    const accuracy = Math.round((session.correct / session.attempted) * 100);
                    const date = new Date(session.createdAt).toLocaleDateString("en-AU", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    });
                    const accuracyColor =
                      accuracy < 55
                        ? "text-danger"
                        : accuracy <= 65
                          ? "text-warning"
                          : "text-success";
                    return (
                      <tr
                        key={session.id}
                        className={`transition-colors duration-150 hover:bg-gray-50 ${
                          session.id === highlightId ? "animate-row-highlight" : ""
                        }`}
                      >
                        <td className="px-5 py-3 text-[14px] text-gray-900">{session.topic}</td>
                        <td className="px-5 py-3 tabular-nums text-[14px] text-secondary whitespace-nowrap">{date}</td>
                        <td className="px-5 py-3 tabular-nums text-[14px] text-gray-900">{session.attempted}</td>
                        <td className="px-5 py-3 tabular-nums text-[14px] text-gray-900">{session.correct}</td>
                        <td className="px-5 py-3">
                          <span className={`tabular-nums text-[14px] font-medium ${accuracyColor}`}>
                            {accuracy}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

export default StudySessionsPage;
