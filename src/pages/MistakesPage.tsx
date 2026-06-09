import { useState } from "react";
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

  const inputClass =
    "w-full rounded border border-[#E5E5E5] bg-white px-3 py-2 text-[13px] text-[#1C1C1E] focus:border-[#0D9488] focus:outline-none transition-colors";

  const labelClass =
    "mb-1.5 block text-[11px] font-medium uppercase tracking-widest text-[#9CA3AF]";

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: "#F7F6F3" }}>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold tracking-tight text-[#1C1C1E]">
          Mistakes
        </h1>
        <p className="mt-0.5 text-sm text-[#9CA3AF]">
          Record mistakes to identify patterns and focus your revision.
        </p>
      </div>

      {/* ── Form card ──────────────────────────────────────────────── */}
      <div
        className="mb-6 rounded-lg border border-[#E5E5E5] bg-white p-6"
        style={{ maxWidth: "640px" }}
      >
        <h2 className="mb-5 text-[11px] font-semibold uppercase tracking-widest text-[#374151]">
          Add Mistake
        </h2>

        <form onSubmit={handleSaveMistake}>
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

          {/* Question Summary */}
          <div className="mb-4">
            <label className={labelClass}>Question Summary</label>
            <textarea
              rows={3}
              value={questionSummary}
              onChange={(e) => setQuestionSummary(e.target.value)}
              placeholder="Brief description of the question…"
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Why I Got It Wrong */}
          <div className="mb-4">
            <label className={labelClass}>Why I Got It Wrong</label>
            <textarea
              rows={3}
              value={whyWrong}
              onChange={(e) => setWhyWrong(e.target.value)}
              placeholder="What confused you or what did you miss…"
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Correct Concept */}
          <div className="mb-5">
            <label className={labelClass}>Correct Concept</label>
            <textarea
              rows={3}
              value={correctConcept}
              onChange={(e) => setCorrectConcept(e.target.value)}
              placeholder="The key fact or principle to remember…"
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Save */}
          <button
            type="submit"
            className="rounded px-5 py-2 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#0D9488" }}
          >
            Save Mistake
          </button>
        </form>
      </div>

      {/* ── Mistakes table ─────────────────────────────────────────── */}
      {mistakes.length === 0 ? (
        <div className="rounded-lg border border-[#E5E5E5] bg-white p-10 text-center">
          <p className="text-sm text-[#9CA3AF]">
            No mistakes logged yet. Add your first one above.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-[#E5E5E5] bg-white">
          {/* Table header bar */}
          <div className="border-b border-[#E5E5E5] px-6 py-4">
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-[#374151]">
              Past Mistakes
            </h2>
          </div>

          <table className="w-full table-fixed">
            <colgroup>
              <col style={{ width: "14%" }} />
              <col style={{ width: "26%" }} />
              <col style={{ width: "24%" }} />
              <col style={{ width: "24%" }} />
              <col style={{ width: "12%" }} />
            </colgroup>
            <thead>
              <tr className="border-b border-[#E5E5E5]">
                {[
                  "Topic",
                  "Question Summary",
                  "Why Wrong",
                  "Correct Concept",
                  "Date",
                ].map((col) => (
                  <th
                    key={col}
                    className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-[#9CA3AF]"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mistakes.map((mistake, i) => {
                const date = new Date(mistake.createdAt).toLocaleDateString(
                  "en-AU",
                  { day: "2-digit", month: "short", year: "numeric" },
                );
                return (
                  <tr
                    key={mistake.id}
                    className="border-b border-[#E5E5E5] align-top last:border-0"
                    style={{
                      backgroundColor: i % 2 === 0 ? "#FFFFFF" : "#FAFAFA",
                    }}
                  >
                    <td className="px-4 py-3 text-[12px] font-medium text-[#374151]">
                      {mistake.topic}
                    </td>
                    <td className="px-4 py-3 text-[12px] leading-relaxed text-[#374151]">
                      {mistake.questionSummary}
                    </td>
                    <td className="px-4 py-3 text-[12px] leading-relaxed text-[#6B7280]">
                      {mistake.whyWrong}
                    </td>
                    <td className="px-4 py-3 text-[12px] leading-relaxed text-[#374151]">
                      {mistake.correctConcept}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-[12px] text-[#9CA3AF]">
                      {date}
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

export default MistakesPage;
