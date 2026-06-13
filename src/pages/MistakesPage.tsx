import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import type { Mistake, AMCTopic } from "../types";
import { getMistakes, saveMistake } from "../services/storage";
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
  "w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-[14px] text-gray-900 transition-all duration-150 placeholder:text-tertiary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20";

const labelCls = "mb-1.5 block text-[13px] font-medium text-secondary";

function MistakesPage() {
  const [topic, setTopic] = useState<AMCTopic>("Cardiology");
  const [questionSummary, setQuestionSummary] = useState("");
  const [whyWrong, setWhyWrong] = useState("");
  const [correctConcept, setCorrectConcept] = useState("");
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

  const uniqueTopics = new Set(mistakes.map((m) => m.topic)).size;

  return (
    <AppShell>
      <div className="mx-auto w-4/5 px-6 py-8">

        <SectionTitle
          title="Mistakes"
          subtitle="Every mistake logged is a pattern found."
        />

        <div className="grid grid-cols-[380px_1fr] items-start gap-6">

          {/* Form card */}
          <Card padding>
            <h2 className="mb-5 text-[15px] font-semibold text-gray-900">Log mistake</h2>

            <form onSubmit={handleSaveMistake}>
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

              <Button type="submit">Save mistake</Button>
            </form>
          </Card>

          {/* Table column */}
          <div className="flex flex-col gap-3">
            {mistakes.length > 0 && (
              <p className="tabular-nums text-[13px] text-tertiary">
                {mistakes.length} {mistakes.length === 1 ? "mistake" : "mistakes"} ·{" "}
                {uniqueTopics} {uniqueTopics === 1 ? "topic" : "topics"}
              </p>
            )}

            <Card overflow>
              {mistakes.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                  <p className="text-[15px] font-semibold text-gray-900">No mistakes logged yet</p>
                  <p className="mt-1.5 max-w-[240px] text-[14px] text-secondary">
                    They'll appear here as patterns to learn from.
                  </p>
                </div>
              ) : (
                <table className="w-full table-fixed">
                  <colgroup>
                    <col className="w-[18%]" />
                    <col className="w-[22%]" />
                    <col className="w-[20%]" />
                    <col className="w-[24%]" />
                    <col className="w-[16%]" />
                  </colgroup>
                  <thead>
                    <tr className="border-b border-black/10">
                      {["Topic", "Question summary", "Why wrong", "Correct concept", "Date"].map((col) => (
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
                    {mistakes.map((mistake) => {
                      const date = new Date(mistake.createdAt).toLocaleDateString("en-AU", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      });
                      return (
                        <tr
                          key={mistake.id}
                          className="align-top transition-colors duration-150 hover:bg-gray-50"
                        >
                          <td className="overflow-hidden px-5 py-3">
                            <span
                              title={mistake.topic}
                              className="inline-block max-w-full truncate rounded-full bg-accent-soft px-2.5 py-0.5 text-[12px] font-medium text-accent"
                            >
                              {mistake.topic}
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            <div className="line-clamp-2 text-[14px] leading-relaxed text-gray-900">
                              {mistake.questionSummary}
                            </div>
                          </td>
                          <td className="px-5 py-3">
                            <div className="line-clamp-2 text-[14px] leading-relaxed text-secondary">
                              {mistake.whyWrong}
                            </div>
                          </td>
                          <td className="px-5 py-3">
                            <div className="line-clamp-2 text-[14px] leading-relaxed text-gray-900">
                              {mistake.correctConcept}
                            </div>
                          </td>
                          <td className="px-5 py-3">
                            <span className="whitespace-nowrap tabular-nums text-[13px] text-secondary">
                              {date}
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
      </div>
    </AppShell>
  );
}

export default MistakesPage;
