/**
 * Form to log a mistake: topic, question summary, why it was wrong, correct concept.
 * All three text fields are required. Writes to Supabase and refetches the list on submit.
 *
 * Visual experiment: layered-surface (no borders), topic color system, card-per-mistake layout.
 * Do not propagate these design choices to other files.
 */
import { useState, useEffect, Fragment } from "react";
import { v4 as uuidv4 } from "uuid";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { Mistake, AMCTopic } from "../types";
import { getMistakes, saveMistake } from "../services/storage";
import { AppShell } from "../components/AppShell";
import { Button } from "../components/Button";
import { SectionTitle } from "../components/SectionTitle";
import { TopicPill, TopicSelect } from "../constants/topicColors";

// ── Constants ────────────────────────────────────────────────────────────────

const labelCls =
  "mb-1 block text-[11px] font-semibold uppercase tracking-[0.06em] text-secondary";

const DAY = 86_400_000;

// ── Helpers ──────────────────────────────────────────────────────────────────

function getMondayStr(ms: number): string {
  const dow = new Date(ms).getUTCDay();
  const daysBack = (dow + 6) % 7;
  return new Date(ms - daysBack * DAY).toISOString().slice(0, 10);
}

function getWeekLabel(mondayStr: string, thisWeekMonday: string): string {
  if (mondayStr === thisWeekMonday) return "This week";
  const prevMondayStr = new Date(new Date(thisWeekMonday).getTime() - 7 * DAY)
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

// ── Page ─────────────────────────────────────────────────────────────────────

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

  // ── Summary card computations ──────────────────────────────────────────────
  const now = Date.now();
  const thisWeekMonday = getMondayStr(now);

  const thisWeekCount = mistakes.filter(
    (m) => now - new Date(m.createdAt).getTime() < 7 * DAY,
  ).length;
  const totalSubtext =
    thisWeekCount === 0
      ? "None logged this week"
      : `${thisWeekCount} logged this week`;

  const topicCounts: Record<string, number> = {};
  for (const m of mistakes) {
    topicCounts[m.topic] = (topicCounts[m.topic] ?? 0) + 1;
  }
  const mostRecurringEntry = Object.entries(topicCounts).sort(
    (a, b) => b[1] - a[1],
  )[0] as [AMCTopic, number] | undefined;
  const mostRecurringSubtext = mostRecurringEntry
    ? `${Math.round((mostRecurringEntry[1] / mistakes.length) * 100)}% of all your mistakes`
    : "—";

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

  // ── Week groups ────────────────────────────────────────────────────────────
  const weekGroups: Record<string, Mistake[]> = {};
  for (const m of mistakes) {
    const monday = getMondayStr(new Date(m.createdAt).getTime());
    if (!weekGroups[monday]) weekGroups[monday] = [];
    weekGroups[monday].push(m);
  }
  const sortedWeekMondays = Object.keys(weekGroups).sort().reverse();

  // ── Form ──────────────────────────────────────────────────────────────────
  const formCard = (
    <div className="rounded-xl bg-white p-5">
      <h2 className="mb-4 text-[15px] font-semibold text-gray-900">
        Log mistake
      </h2>
      <form onSubmit={handleSaveMistake} noValidate>
        {/* Row 1: topic select + question summary */}
        <div className="mb-4 grid grid-cols-[180px_1fr] items-start gap-3">
          <div>
            <p className={labelCls}>Topic</p>
            <TopicSelect value={topic} onChange={setTopic} />
          </div>
          <div>
            <label htmlFor="mistake-question" className={labelCls}>
              Question summary{" "}
              <span className="text-danger" aria-hidden="true">*</span>
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
              className="w-full resize-none rounded-lg bg-gray-100 px-3 py-2 text-[14px] text-gray-900 placeholder:text-secondary/60 outline-none transition-colors focus:bg-gray-50"
            />
          </div>
        </div>

        {/* Row 2: connected why wrong + correct concept */}
        <div className="mb-4 overflow-hidden rounded-xl bg-gray-100">
          <div className="px-4 pt-3 pb-2">
            <label htmlFor="mistake-why" className={labelCls}>
              Why I got it wrong{" "}
              <span className="text-danger" aria-hidden="true">*</span>
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
              className="w-full resize-none bg-transparent text-[14px] text-gray-900 placeholder:text-secondary/60 outline-none"
            />
          </div>
          <div className="border-t border-black/[0.06] px-4 pt-3 pb-3">
            <label htmlFor="mistake-concept" className={labelCls}>
              Correct concept{" "}
              <span className="text-danger" aria-hidden="true">*</span>
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
              className="w-full resize-none bg-transparent text-[14px] text-gray-900 placeholder:text-secondary/60 outline-none"
            />
          </div>
        </div>

        {validationError && (
          <p role="alert" className="mb-4 text-[13px] text-danger">
            {validationError}
          </p>
        )}

        <Button type="submit">Save mistake</Button>
      </form>
    </div>
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
            <div className="mt-6 rounded-xl bg-white">
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
            {/* ── Summary cards ─────────────────────────────────────────── */}
            <div className="mb-6 grid grid-cols-3 gap-3 sm:gap-4">

              {/* Card 1 – Total mistakes */}
              <div className="rounded-xl bg-white p-5">
                <p className="mb-2 text-[13px] text-secondary">Total mistakes</p>
                <p className="text-[24px] font-medium leading-none text-gray-900">
                  {mistakes.length}
                </p>
                <p className="mt-2 text-[12px] text-secondary">{totalSubtext}</p>
              </div>

              {/* Card 2 – Most recurring */}
              <div className="rounded-xl bg-white p-5">
                <p className="mb-2 text-[13px] text-secondary">Most recurring</p>
                {mostRecurringEntry ? (
                  <div className="mb-1">
                    <TopicPill topic={mostRecurringEntry[0]} />
                  </div>
                ) : (
                  <p className="text-[24px] font-medium leading-none text-gray-900">—</p>
                )}
                <p className="mt-2 text-[12px] text-secondary">
                  {mostRecurringSubtext}
                </p>
              </div>

              {/* Card 3 – Last logged */}
              <div className="rounded-xl bg-white p-5">
                <p className="mb-2 text-[13px] text-secondary">Last logged</p>
                <p className={`text-[24px] font-medium leading-none ${lastMistakeColor}`}>
                  {lastMistakeText}
                </p>
                <p className="mt-2 text-[12px] text-secondary">
                  {lastMistakeSubtext}
                </p>
              </div>

            </div>

            {/* ── Form ──────────────────────────────────────────────────── */}
            <div className="mb-6">{formCard}</div>

            {/* ── Mistake cards grouped by week ─────────────────────────── */}
            <div className="space-y-3">
              {sortedWeekMondays.map((monday) => {
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
                    <button
                      type="button"
                      onClick={() => toggleWeek(monday)}
                      className="flex w-full items-center justify-between rounded-xl bg-gray-100 px-5 py-3.5 transition-colors duration-100 hover:bg-gray-200/70"
                    >
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
                        {weekMistakes.length === 1 ? "mistake" : "mistakes"}
                      </span>
                    </button>

                    {/* Mistake cards */}
                    {isExpanded && (
                      <div className="flex flex-col gap-3 px-1">
                        {sortedMistakes.map((mistake) => {
                          const date = new Date(
                            mistake.createdAt,
                          ).toLocaleDateString("en-AU", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          });
                          return (
                            <div key={mistake.id} className="rounded-xl bg-white p-4">
                              {/* Header: topic pill + date */}
                              <div className="mb-2.5 flex items-center justify-between gap-3">
                                <TopicPill topic={mistake.topic} />
                                <span className="shrink-0 text-[12px] text-secondary">
                                  {date}
                                </span>
                              </div>

                              {/* Question summary */}
                              <p className="mb-3 text-[14px] font-medium leading-relaxed text-gray-900">
                                {mistake.questionSummary}
                              </p>

                              {/* Why wrong + correct concept */}
                              <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-secondary">
                                  Why wrong
                                </p>
                                <p className="mt-1 text-[13px] leading-relaxed text-secondary">
                                  {mistake.whyWrong}
                                </p>
                                <div className="my-3 h-px bg-black/[0.05]" />
                                <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-secondary">
                                  Correct concept
                                </p>
                                <p className="mt-1 text-[13px] leading-relaxed text-gray-900">
                                  {mistake.correctConcept}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </Fragment>
                );
              })}
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}

export default MistakesPage;
