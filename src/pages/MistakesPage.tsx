/**
 * Form to log a mistake: topic, question summary, why it was wrong, correct concept.
 * All three text fields are required. Writes to Supabase and refetches the list on submit.
 */
import { useState, useEffect, Fragment } from "react";
import { v4 as uuidv4 } from "uuid";
import { ChevronDown, ChevronRight } from "lucide-react";
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
  "w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-[14px] text-gray-900 transition-all duration-150 placeholder:text-secondary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20";

const labelCls = "mb-1.5 block text-[13px] font-medium text-secondary";

const DAY = 86_400_000;

function getMondayStr(ms: number): string {
  const dow = new Date(ms).getUTCDay(); // 0 = Sunday
  const daysBack = (dow + 6) % 7; // Mon→0, Tue→1, …, Sun→6
  return new Date(ms - daysBack * DAY).toISOString().slice(0, 10);
}

function getWeekLabel(mondayStr: string, thisWeekMonday: string): string {
  if (mondayStr === thisWeekMonday) return "This week";
  const prevMondayStr = new Date(
    new Date(thisWeekMonday).getTime() - 7 * DAY,
  )
    .toISOString()
    .slice(0, 10);
  if (mondayStr === prevMondayStr) return "Last week";
  const mondayMs = new Date(mondayStr).getTime();
  const sundayMs = mondayMs + 6 * DAY;
  const fmt = (ms: number) =>
    new Date(ms).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
  return `${fmt(mondayMs)} – ${fmt(sundayMs)}`;
}

function MistakesPage() {
  const [topic, setTopic] = useState<AMCTopic>("Cardiology");
  const [questionSummary, setQuestionSummary] = useState("");
  const [whyWrong, setWhyWrong] = useState("");
  const [correctConcept, setCorrectConcept] = useState("");
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [validationError, setValidationError] = useState("");
  const [expandedWeeks, setExpandedWeeks] = useState<Record<string, boolean>>(
    () => ({ [getMondayStr(Date.now())]: true }),
  );

  useEffect(() => {
    getMistakes().then(setMistakes);
  }, []);

  const handleSaveMistake = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionSummary || !whyWrong || !correctConcept) {
      setValidationError("Please fill in all required fields.");
      return;
    }
    setValidationError("");
    const newMistake: Mistake = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      topic,
      questionSummary,
      whyWrong,
      correctConcept,
    };
    await saveMistake(newMistake);
    setMistakes(await getMistakes());
    setQuestionSummary("");
    setWhyWrong("");
    setCorrectConcept("");
  };

  const toggleWeek = (monday: string) => {
    setExpandedWeeks((prev) => ({ ...prev, [monday]: !prev[monday] }));
  };

  // ── Summary card computations ────────────────────────────────────────────
  const now = Date.now();
  const thisWeekMonday = getMondayStr(now);

  // Card 1 – Total mistakes
  const thisWeekCount = mistakes.filter(
    (m) => now - new Date(m.createdAt).getTime() < 7 * DAY,
  ).length;
  const totalSubtext =
    thisWeekCount === 0
      ? "None logged this week"
      : `${thisWeekCount} logged this week`;

  // Card 2 – Most recurring
  const topicCounts: Record<string, number> = {};
  for (const m of mistakes) {
    topicCounts[m.topic] = (topicCounts[m.topic] ?? 0) + 1;
  }
  const mostRecurringEntry = Object.entries(topicCounts).sort(
    (a, b) => b[1] - a[1],
  )[0];
  const mostRecurringTopic = mostRecurringEntry?.[0] ?? "—";
  const mostRecurringSubtext = mostRecurringEntry
    ? `${Math.round((mostRecurringEntry[1] / mistakes.length) * 100)}% of all your mistakes`
    : "—";

  // Card 3 – Last logged
  const lastMistake =
    mistakes.length > 0
      ? [...mistakes].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )[0]
      : null;
  const lastMistakeDays = lastMistake
    ? Math.floor((now - new Date(lastMistake.createdAt).getTime()) / DAY)
    : null;
  const lastMistakeText =
    lastMistakeDays === null
      ? "—"
      : lastMistakeDays === 0
        ? "Today"
        : lastMistakeDays === 1
          ? "Yesterday"
          : `${lastMistakeDays}d ago`;
  const lastMistakeColor =
    lastMistakeDays === null || lastMistakeDays >= 7
      ? "text-danger"
      : lastMistakeDays <= 1
        ? "text-success"
        : "text-warning";
  const lastMistakeSubtext =
    lastMistakeDays === null || lastMistakeDays >= 7
      ? "No mistakes reviewed recently"
      : lastMistakeDays <= 1
        ? "Reviewing mistakes regularly"
        : "Consider reviewing recent mistakes";

  // ── Week groups for table ────────────────────────────────────────────────
  const weekGroups: Record<string, Mistake[]> = {};
  for (const m of mistakes) {
    const monday = getMondayStr(new Date(m.createdAt).getTime());
    if (!weekGroups[monday]) weekGroups[monday] = [];
    weekGroups[monday].push(m);
  }
  const sortedWeekMondays = Object.keys(weekGroups).sort().reverse();

  // ── Form card ────────────────────────────────────────────────────────────
  const formCard = (
    <Card padding>
      <h2 className="mb-5 text-[15px] font-semibold text-gray-900">
        Log mistake
      </h2>

      <form onSubmit={handleSaveMistake} noValidate>
        <div className="mb-4">
          <label htmlFor="mistake-topic" className={labelCls}>
            Topic
          </label>
          <select
            id="mistake-topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value as AMCTopic)}
            className={`h-[38px] ${inputCls}`}
          >
            {AMC_TOPICS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="mistake-question" className={labelCls}>
            Question summary{" "}
            <span className="text-danger" aria-hidden="true">
              *
            </span>
          </label>
          <textarea
            id="mistake-question"
            rows={3}
            value={questionSummary}
            onChange={(e) => {
              setQuestionSummary(e.target.value);
              setValidationError("");
            }}
            placeholder="Brief description of the question…"
            className={`${inputCls} resize-none`}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="mistake-why" className={labelCls}>
            Why I got it wrong{" "}
            <span className="text-danger" aria-hidden="true">
              *
            </span>
          </label>
          <textarea
            id="mistake-why"
            rows={3}
            value={whyWrong}
            onChange={(e) => {
              setWhyWrong(e.target.value);
              setValidationError("");
            }}
            placeholder="What confused you or what did you miss…"
            className={`${inputCls} resize-none`}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="mistake-concept" className={labelCls}>
            Correct concept{" "}
            <span className="text-danger" aria-hidden="true">
              *
            </span>
          </label>
          <textarea
            id="mistake-concept"
            rows={3}
            value={correctConcept}
            onChange={(e) => {
              setCorrectConcept(e.target.value);
              setValidationError("");
            }}
            placeholder="The key fact or principle to remember…"
            className={`${inputCls} resize-none`}
          />
        </div>

        {validationError && (
          <p role="alert" className="mb-4 text-[13px] text-danger">
            {validationError}
          </p>
        )}

        <Button type="submit">Save mistake</Button>
      </form>
    </Card>
  );

  return (
    <AppShell>
      <div className="mx-auto w-full px-4 py-6 sm:px-6 sm:py-8 lg:w-4/5">
        <SectionTitle
          title="Mistakes"
          subtitle="Every mistake logged is a pattern found."
        />

        {mistakes.length === 0 ? (
          <>
            {formCard}
            <div className="mt-6 rounded-xl border border-black/10 bg-white">
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <p className="text-[15px] font-semibold text-gray-900">
                  No mistakes logged yet
                </p>
                <p className="mt-1.5 max-w-[240px] text-[14px] text-secondary">
                  They'll appear here as patterns to learn from.
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* ── Summary cards ───────────────────────────────────────── */}
            <div className="mb-6 grid grid-cols-3 gap-3 sm:gap-4">

              {/* Card 1 – Total mistakes */}
              <div className="rounded-xl border border-black/10 bg-white p-5">
                <p className="mb-2 text-[13px] text-secondary">
                  Total mistakes
                </p>
                <p className="text-[24px] font-medium leading-none text-gray-900">
                  {mistakes.length}
                </p>
                <p className="mt-2 text-[12px] text-secondary">
                  {totalSubtext}
                </p>
              </div>

              {/* Card 2 – Most recurring */}
              <div className="rounded-xl border border-black/10 bg-white p-5">
                <p className="mb-2 text-[13px] text-secondary">
                  Most recurring
                </p>
                <p className="text-[18px] font-medium leading-tight text-gray-900 line-clamp-2">
                  {mostRecurringTopic}
                </p>
                <p className="mt-2 text-[12px] text-secondary">
                  {mostRecurringSubtext}
                </p>
              </div>

              {/* Card 3 – Last logged */}
              <div className="rounded-xl border border-black/10 bg-white p-5">
                <p className="mb-2 text-[13px] text-secondary">Last logged</p>
                <p
                  className={`text-[24px] font-medium leading-none ${lastMistakeColor}`}
                >
                  {lastMistakeText}
                </p>
                <p className="mt-2 text-[12px] text-secondary">
                  {lastMistakeSubtext}
                </p>
              </div>

            </div>

            {/* ── Form ────────────────────────────────────────────────── */}
            <div className="mb-6">{formCard}</div>

            {/* ── Mistakes table grouped by week ───────────────────────── */}
            <div className="rounded-xl border border-black/10 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] table-fixed">
                  <colgroup>
                    <col className="w-[18%]" />
                    <col className="w-[22%]" />
                    <col className="w-[20%]" />
                    <col className="w-[24%]" />
                    <col className="w-[16%]" />
                  </colgroup>
                  <tbody>
                    {sortedWeekMondays.map((monday, weekIdx) => {
                      const weekMistakes = weekGroups[monday];
                      const isExpanded = !!expandedWeeks[monday];
                      const label = getWeekLabel(monday, thisWeekMonday);
                      const sortedMistakes = [...weekMistakes].sort(
                        (a, b) =>
                          new Date(b.createdAt).getTime() -
                          new Date(a.createdAt).getTime(),
                      );
                      return (
                        <Fragment key={monday}>
                          {/* Week group header */}
                          <tr
                            onClick={() => toggleWeek(monday)}
                            className={`cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-100 ${weekIdx > 0 ? "border-t border-black/10" : ""}`}
                          >
                            <td colSpan={5} className="px-5 py-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {isExpanded ? (
                                    <ChevronDown className="h-4 w-4 shrink-0 text-secondary" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4 shrink-0 text-secondary" />
                                  )}
                                  <span className="text-[14px] font-medium text-gray-900">
                                    {label}
                                  </span>
                                </div>
                                <span className="text-[13px] text-secondary">
                                  {weekMistakes.length}{" "}
                                  {weekMistakes.length === 1
                                    ? "mistake"
                                    : "mistakes"}
                                </span>
                              </div>
                            </td>
                          </tr>

                          {/* Column headers + rows (when expanded) */}
                          {isExpanded && (
                            <>
                              <tr className="border-t border-black/5 bg-white">
                                {[
                                  "Topic",
                                  "Question summary",
                                  "Why wrong",
                                  "Correct concept",
                                  "Date",
                                ].map((col) => (
                                  <th
                                    key={col}
                                    className="px-5 py-2 text-left text-[11px] font-medium uppercase tracking-[0.06em] text-secondary"
                                  >
                                    {col}
                                  </th>
                                ))}
                              </tr>
                              {sortedMistakes.map((mistake) => {
                                const date = new Date(
                                  mistake.createdAt,
                                ).toLocaleDateString("en-AU", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                });
                                return (
                                  <tr
                                    key={mistake.id}
                                    className="border-t border-black/5 align-top transition-colors duration-150 hover:bg-gray-50"
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
                            </>
                          )}
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}

export default MistakesPage;
