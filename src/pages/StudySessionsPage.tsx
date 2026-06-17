/**
 * Form to log a study session (topic, attempted, correct, incorrect, notes).
 * Validates that correct + incorrect === attempted before saving. Writes to Supabase
 * and refetches the full list so the table stays in sync.
 */
import { useState, useEffect, Fragment } from "react";
import { v4 as uuidv4 } from "uuid";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { StudySession, AMCTopic } from "../types";
import { getSessions, saveSession } from "../services/storage";
import { AppShell } from "../components/AppShell";
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
  "h-[38px] w-full rounded-lg border border-black/10 bg-white px-3 text-[14px] text-gray-900 transition-all duration-150 placeholder:text-secondary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20";

const monoInputCls =
  "h-[38px] w-full rounded-lg border border-black/10 bg-white px-3 tabular-nums text-[14px] text-gray-900 transition-all duration-150 placeholder:text-secondary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20";

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


function StudySessionsPage() {
  const [topic, setTopic] = useState<AMCTopic>("Cardiology");
  const [attempted, setAttempted] = useState("");
  const [correct, setCorrect] = useState("");
  const [incorrect, setIncorrect] = useState("");
  const [notes, setNotes] = useState("");
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [expandedWeeks, setExpandedWeeks] = useState<Record<string, boolean>>(
    () => ({ [getMondayStr(Date.now())]: true }),
  );

  useEffect(() => {
    getSessions().then(setSessions);
  }, []);
  const [validationError, setValidationError] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(correct) + Number(incorrect) !== Number(attempted)) {
      setValidationError("Correct + Incorrect must equal Attempted.");
      return;
    }
    setValidationError("");
    const newSession: StudySession = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      topic,
      attempted: Number(attempted),
      correct: Number(correct),
      incorrect: Number(incorrect),
      notes: notes || undefined,
    };
    await saveSession(newSession);
    setSessions(await getSessions());
    setAttempted("");
    setCorrect("");
    setIncorrect("");
    setNotes("");
    setHighlightId(newSession.id);
    setTimeout(() => setHighlightId(null), 900);
  };

  const toggleWeek = (monday: string) => {
    setExpandedWeeks((prev) => ({ ...prev, [monday]: !prev[monday] }));
  };

  // ── Summary card computations ────────────────────────────────────────────
  const now = Date.now();
  const thisWeekMonday = getMondayStr(now);

  // Card 1 – This week
  const thisWeekCount = sessions.filter(
    (s) => now - new Date(s.createdAt).getTime() < 7 * DAY,
  ).length;
  const priorWeekCounts = [0, 1, 2, 3].map((i) =>
    sessions.filter((s) => {
      const age = now - new Date(s.createdAt).getTime();
      return age >= (7 + i * 7) * DAY && age < (14 + i * 7) * DAY;
    }).length,
  );
  const hasEnoughHistory = sessions.some(
    (s) => now - new Date(s.createdAt).getTime() >= 28 * DAY,
  );
  const fourWeekAvg = hasEnoughHistory
    ? Math.round(priorWeekCounts.reduce((a, b) => a + b, 0) / 4)
    : null;
  const thisWeekValueColor =
    fourWeekAvg === null
      ? "text-secondary"
      : thisWeekCount >= fourWeekAvg
        ? "text-success"
        : "text-danger";
  const thisWeekSubtext =
    fourWeekAvg === null
      ? "Not enough history yet"
      : `Your 4-week average: ${fourWeekAvg} session${fourWeekAvg === 1 ? "" : "s"}`;

  // Card 2 – Most practiced
  const topicCounts: Record<string, number> = {};
  for (const s of sessions) {
    topicCounts[s.topic] = (topicCounts[s.topic] ?? 0) + 1;
  }
  const mostPracticedEntry = Object.entries(topicCounts).sort(
    (a, b) => b[1] - a[1],
  )[0];
  const mostPracticedTopic = mostPracticedEntry?.[0] ?? "—";
  const mostPracticedSubtext = mostPracticedEntry
    ? `${Math.round((mostPracticedEntry[1] / sessions.length) * 100)}% of all your sessions`
    : "—";

  // Card 3 – Last logged
  const lastSession =
    sessions.length > 0
      ? [...sessions].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )[0]
      : null;
  const lastLoggedDays = lastSession
    ? Math.floor((now - new Date(lastSession.createdAt).getTime()) / DAY)
    : null;
  const lastLoggedText =
    lastLoggedDays === null
      ? "—"
      : lastLoggedDays === 0
        ? "Today"
        : lastLoggedDays === 1
          ? "Yesterday"
          : `${lastLoggedDays}d ago`;
  const lastLoggedColor =
    lastLoggedDays === null || lastLoggedDays >= 5
      ? "text-danger"
      : lastLoggedDays <= 1
        ? "text-success"
        : "text-warning";

  // Consecutive-day streak (UTC days)
  const sessionDaySet = new Set(sessions.map((s) => s.createdAt.slice(0, 10)));
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const dayStr = new Date(now - i * DAY).toISOString().slice(0, 10);
    if (sessionDaySet.has(dayStr)) {
      streak++;
    } else {
      break;
    }
  }
  const streakText =
    streak <= 1
      ? "No active streak"
      : `${streak} consecutive days logged`;

  // ── Week groups for table ────────────────────────────────────────────────
  const weekGroups: Record<string, StudySession[]> = {};
  for (const s of sessions) {
    const monday = getMondayStr(new Date(s.createdAt).getTime());
    if (!weekGroups[monday]) weekGroups[monday] = [];
    weekGroups[monday].push(s);
  }
  const sortedWeekMondays = Object.keys(weekGroups).sort().reverse();

  // ── Form card (always visible) ───────────────────────────────────────────
  const formCard = (
    <div className="rounded-xl border border-black/10 bg-white p-5">
      <h2 className="mb-4 text-[13px] font-semibold uppercase tracking-[0.06em] text-secondary">
        Add session
      </h2>
      <form onSubmit={handleSave} noValidate>
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[140px] flex-[2]">
            <label htmlFor="session-topic" className={labelCls}>
              Topic
            </label>
            <select
              id="session-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value as AMCTopic)}
              className={inputCls}
            >
              {AMC_TOPICS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="w-[84px] shrink-0">
            <label htmlFor="session-attempted" className={labelCls}>
              Attempted
            </label>
            <input
              id="session-attempted"
              type="number"
              min="0"
              value={attempted}
              onChange={(e) => {
                setAttempted(e.target.value);
                setValidationError("");
              }}
              className={monoInputCls}
              placeholder="0"
            />
          </div>
          <div className="w-[76px] shrink-0">
            <label htmlFor="session-correct" className={labelCls}>
              Correct
            </label>
            <input
              id="session-correct"
              type="number"
              min="0"
              value={correct}
              onChange={(e) => {
                setCorrect(e.target.value);
                setValidationError("");
              }}
              className={monoInputCls}
              placeholder="0"
            />
          </div>
          <div className="w-[76px] shrink-0">
            <label htmlFor="session-incorrect" className={labelCls}>
              Incorrect
            </label>
            <input
              id="session-incorrect"
              type="number"
              min="0"
              value={incorrect}
              onChange={(e) => {
                setIncorrect(e.target.value);
                setValidationError("");
              }}
              className={monoInputCls}
              placeholder="0"
            />
          </div>
          <div className="shrink-0">
            <Button type="submit">Save session</Button>
          </div>
        </div>
        {validationError && (
          <p role="alert" className="mt-2 text-[13px] text-danger">
            {validationError}
          </p>
        )}
        <div className="mt-3">
          <label htmlFor="session-notes" className={labelCls}>
            Notes
          </label>
          <textarea
            id="session-notes"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional notes about this session…"
            className="w-full resize-none rounded-lg border border-black/10 bg-white px-3 py-2 text-[14px] text-gray-900 transition-all duration-150 placeholder:text-secondary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </div>
      </form>
    </div>
  );

  return (
    <AppShell>
      <div className="mx-auto w-full px-4 py-6 sm:px-6 sm:py-8 lg:w-4/5">
        <SectionTitle
          title="Study Sessions"
          subtitle="Log your practice sessions to track performance over time."
        />

        {sessions.length === 0 ? (
          <>
            {formCard}
            <div className="mt-6 rounded-xl border border-black/10 bg-white">
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <p className="text-[15px] font-semibold text-gray-900">
                  No sessions logged yet
                </p>
                <p className="mt-1.5 max-w-[240px] text-[14px] text-secondary">
                  Your history will appear here.
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* ── Summary cards ─────────────────────────────────────────── */}
            <div className="mb-6 grid grid-cols-3 gap-3 sm:gap-4">

              {/* Card 1 – This week */}
              <div className="rounded-xl border border-black/10 bg-white p-5">
                <p className="mb-2 text-[13px] text-secondary">This week</p>
                <p className={`text-[24px] font-medium leading-none ${thisWeekValueColor}`}>
                  {thisWeekCount} session{thisWeekCount === 1 ? "" : "s"}
                </p>
                <p className="mt-2 text-[12px] text-secondary">{thisWeekSubtext}</p>
              </div>

              {/* Card 2 – Most practiced */}
              <div className="rounded-xl border border-black/10 bg-white p-5">
                <p className="mb-2 text-[13px] text-secondary">Most practiced</p>
                <p className="text-[18px] font-medium leading-tight text-gray-900 line-clamp-2">
                  {mostPracticedTopic}
                </p>
                <p className="mt-2 text-[12px] text-secondary">{mostPracticedSubtext}</p>
              </div>

              {/* Card 3 – Last logged */}
              <div className="rounded-xl border border-black/10 bg-white p-5">
                <p className="mb-2 text-[13px] text-secondary">Last logged</p>
                <p className={`text-[24px] font-medium leading-none ${lastLoggedColor}`}>
                  {lastLoggedText}
                </p>
                <p className="mt-2 text-[12px] text-secondary">{streakText}</p>
              </div>

            </div>

            {/* ── Form ──────────────────────────────────────────────────── */}
            <div className="mb-6">{formCard}</div>

            {/* ── Sessions table grouped by week ────────────────────────── */}
            <div className="rounded-xl border border-black/10 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px]">
                  <tbody>
                    {sortedWeekMondays.map((monday, weekIdx) => {
                      const weekSessions = weekGroups[monday];
                      const isExpanded = !!expandedWeeks[monday];
                      const label = getWeekLabel(monday, thisWeekMonday);
                      const sortedSessions = [...weekSessions].sort(
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
                                  {weekSessions.length} session{weekSessions.length === 1 ? "" : "s"}
                                </span>
                              </div>
                            </td>
                          </tr>

                          {/* Column header + data rows (when expanded) */}
                          {isExpanded && (
                            <>
                              <tr className="border-t border-black/5 bg-white">
                                {["Topic", "Date", "Attempted", "Correct", "Accuracy"].map((col) => (
                                  <th
                                    key={col}
                                    className="px-5 py-2 text-left text-[11px] font-medium uppercase tracking-[0.06em] text-secondary"
                                  >
                                    {col}
                                  </th>
                                ))}
                              </tr>
                              {sortedSessions.map((session) => {
                                const accuracy = Math.round(
                                  (session.correct / session.attempted) * 100,
                                );
                                const date = new Date(
                                  session.createdAt,
                                ).toLocaleDateString("en-AU", {
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
                                    className={`border-t border-black/5 transition-colors duration-150 hover:bg-gray-50 ${session.id === highlightId ? "animate-row-highlight" : ""}`}
                                  >
                                    <td className="px-5 py-3 text-[14px] text-gray-900">
                                      {session.topic}
                                    </td>
                                    <td className="whitespace-nowrap px-5 py-3 tabular-nums text-[14px] text-secondary">
                                      {date}
                                    </td>
                                    <td className="px-5 py-3 tabular-nums text-[14px] text-gray-900">
                                      {session.attempted}
                                    </td>
                                    <td className="px-5 py-3 tabular-nums text-[14px] text-gray-900">
                                      {session.correct}
                                    </td>
                                    <td className="px-5 py-3">
                                      <span
                                        className={`tabular-nums text-[14px] font-medium ${accuracyColor}`}
                                      >
                                        {accuracy}%
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

export default StudySessionsPage;
