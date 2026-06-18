/**
 * Form to log a study session (topic, attempted, correct, incorrect, notes).
 * Validates that correct + incorrect === attempted before saving. Writes to Supabase
 * and refetches the full list so the view stays in sync.
 *
 * Visual treatment matches MistakesPage: layered surfaces, topic pill system, card-per-session layout.
 */
import { useState, useEffect, Fragment } from "react";
import { v4 as uuidv4 } from "uuid";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { StudySession, AMCTopic } from "../types";
import { getSessions, saveSession } from "../services/storage";
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

// ── Page ─────────────────────────────────────────────────────────────────────

function StudySessionsPage() {
  const [topic, setTopic] = useState<AMCTopic>("Cardiology");
  const [attempted, setAttempted] = useState("");
  const [correct, setCorrect] = useState("");
  const [incorrect, setIncorrect] = useState("");
  const [notes, setNotes] = useState("");
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [validationError, setValidationError] = useState("");
  const [expandedWeeks, setExpandedWeeks] = useState<Record<string, boolean>>(
    () => ({ [getMondayStr(Date.now())]: true }),
  );

  useEffect(() => {
    getSessions().then(setSessions);
  }, []);

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

  // Card 1 – This week (rolling 7d + 4-week avg)
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
  )[0] as [AMCTopic, number] | undefined;
  const mostPracticedSubtext = mostPracticedEntry
    ? `${Math.round((mostPracticedEntry[1] / sessions.length) * 100)}% of all your sessions`
    : "—";

  // Card 3 – Last logged + streak
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
    streak <= 1 ? "No active streak" : `${streak} consecutive days logged`;

  // ── Week groups ──────────────────────────────────────────────────────────
  const weekGroups: Record<string, StudySession[]> = {};
  for (const s of sessions) {
    const monday = getMondayStr(new Date(s.createdAt).getTime());
    if (!weekGroups[monday]) weekGroups[monday] = [];
    weekGroups[monday].push(s);
  }
  const sortedWeekMondays = Object.keys(weekGroups).sort().reverse();

  // ── Form ──────────────────────────────────────────────────────────────────
  const formCard = (
    <div className="rounded-xl bg-white p-5">
      <h2 className="mb-4 text-[15px] font-semibold text-gray-900">
        Add session
      </h2>
      <form onSubmit={handleSave} noValidate>
        {/* Row 1: topic select + connected number trio */}
        <div className="mb-4 grid grid-cols-[160px_1fr] items-start gap-3">
          <div>
            <p className={labelCls}>Topic</p>
            <TopicSelect value={topic} onChange={setTopic} />
          </div>
          <div>
            <p className={labelCls}>Questions</p>
            <div className="grid grid-cols-2 overflow-hidden rounded-xl bg-gray-100 sm:grid-cols-3">
              <div className="flex-1 px-3 py-2.5">
                <label
                  htmlFor="session-attempted"
                  className="mb-0.5 block text-[11px] font-medium text-secondary"
                >
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
                  className="w-full bg-transparent tabular-nums text-[16px] font-medium text-gray-900 outline-none placeholder:text-gray-400"
                  placeholder="—"
                />
              </div>
              <div className="flex-1 border-l border-black/[0.06] px-3 py-2.5">
                <label
                  htmlFor="session-correct"
                  className="mb-0.5 block text-[11px] font-medium text-secondary"
                >
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
                  className="w-full bg-transparent tabular-nums text-[16px] font-medium text-gray-900 outline-none placeholder:text-gray-400"
                  placeholder="—"
                />
              </div>
              <div className="col-span-2 border-t border-black/[0.06] px-3 py-2.5 sm:col-span-1 sm:border-l sm:border-t-0">
                <label
                  htmlFor="session-incorrect"
                  className="mb-0.5 block text-[11px] font-medium text-secondary"
                >
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
                  className="w-full bg-transparent tabular-nums text-[16px] font-medium text-gray-900 outline-none placeholder:text-gray-400"
                  placeholder="—"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="mb-4">
          <label htmlFor="session-notes" className={labelCls}>
            Notes
          </label>
          <textarea
            id="session-notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional notes about this session…"
            className="w-full resize-none rounded-xl bg-gray-100 px-3 py-2 text-[14px] text-gray-900 placeholder:text-secondary/60 outline-none transition-colors focus:bg-gray-50"
          />
        </div>

        {validationError && (
          <p role="alert" className="mb-4 text-[13px] text-danger">
            {validationError}
          </p>
        )}

        <Button type="submit">Save session</Button>
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
            <div className="mt-6 rounded-xl bg-white">
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
              <div className="rounded-xl bg-white p-5">
                <p className="mb-2 text-[13px] text-secondary">This week</p>
                <p className={`text-[24px] font-medium leading-none ${thisWeekValueColor}`}>
                  {thisWeekCount} session{thisWeekCount === 1 ? "" : "s"}
                </p>
                <p className="mt-2 text-[12px] text-secondary">{thisWeekSubtext}</p>
              </div>

              {/* Card 2 – Most practiced */}
              <div className="rounded-xl bg-white p-5">
                <p className="mb-2 text-[13px] text-secondary">Most practiced</p>
                {mostPracticedEntry ? (
                  <div className="mb-1">
                    <TopicPill topic={mostPracticedEntry[0]} />
                  </div>
                ) : (
                  <p className="text-[24px] font-medium leading-none text-gray-900">—</p>
                )}
                <p className="mt-2 text-[12px] text-secondary">{mostPracticedSubtext}</p>
              </div>

              {/* Card 3 – Last logged */}
              <div className="rounded-xl bg-white p-5">
                <p className="mb-2 text-[13px] text-secondary">Last logged</p>
                <p className={`text-[24px] font-medium leading-none ${lastLoggedColor}`}>
                  {lastLoggedText}
                </p>
                <p className="mt-2 text-[12px] text-secondary">{streakText}</p>
              </div>

            </div>

            {/* ── Form ──────────────────────────────────────────────────── */}
            <div className="mb-6">{formCard}</div>

            {/* ── Session cards grouped by week ─────────────────────────── */}
            <div className="space-y-3">
              {sortedWeekMondays.map((monday) => {
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
                        {weekSessions.length} session{weekSessions.length === 1 ? "" : "s"}
                      </span>
                    </button>

                    {/* Session cards */}
                    {isExpanded && (
                      <div className="flex flex-col gap-3 px-1">
                        {sortedSessions.map((session) => {
                          const accuracy =
                            session.attempted > 0
                              ? Math.round(
                                  (session.correct / session.attempted) * 100,
                                )
                              : 0;
                          const accuracyColor =
                            accuracy < 60
                              ? "text-danger"
                              : accuracy <= 70
                                ? "text-warning"
                                : "text-success";
                          const date = new Date(
                            session.createdAt,
                          ).toLocaleDateString("en-AU", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          });

                          return (
                            <div
                              key={session.id}
                              className={`rounded-xl bg-white p-4 ${session.id === highlightId ? "animate-row-highlight" : ""}`}
                            >
                              {/* Header: topic pill + date */}
                              <div className="mb-3 flex items-center justify-between gap-3">
                                <TopicPill topic={session.topic} />
                                <span className="shrink-0 text-[12px] text-secondary">
                                  {date}
                                </span>
                              </div>

                              {/* Stats row */}
                              <div className="flex gap-6">
                                <div>
                                  <p className="text-[11px] font-medium text-secondary">
                                    Attempted
                                  </p>
                                  <p className="mt-0.5 tabular-nums text-[18px] font-medium text-gray-900">
                                    {session.attempted}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-[11px] font-medium text-secondary">
                                    Correct
                                  </p>
                                  <p className="mt-0.5 tabular-nums text-[18px] font-medium text-gray-900">
                                    {session.correct}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-[11px] font-medium text-secondary">
                                    Accuracy
                                  </p>
                                  <p className={`mt-0.5 tabular-nums text-[18px] font-medium ${accuracyColor}`}>
                                    {accuracy}%
                                  </p>
                                </div>
                              </div>

                              {/* Notes (if present) */}
                              {session.notes && (
                                <p className="mt-3 text-[13px] leading-relaxed text-secondary">
                                  {session.notes}
                                </p>
                              )}
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

export default StudySessionsPage;
