/**
 * Pure functions that derive analytics from raw session and mistake data.
 * No API calls, no side effects. These run before any AI call — the prompts
 * pass the computed results, not the raw records.
 */

import type {
  StudySession,
  Mistake,
  RankedTopic,
  MistakeFrequency,
  AMCTopic,
  ExamCountdown,
} from "../types";

// ─── Weak Topics ──────────────────────────────────────────────────────────────

// Groups sessions by topic, calculates average accuracy, and sorts weakest first.
export function getRankedWeakTopics(sessions: StudySession[]): RankedTopic[] {
  if (sessions.length === 0) return [];

  // Group sessions by topic
  const grouped: Partial<Record<AMCTopic, StudySession[]>> = {};
  for (const session of sessions) {
    if (!grouped[session.topic]) grouped[session.topic] = [];
    grouped[session.topic]!.push(session);
  }

  const ranked: RankedTopic[] = Object.entries(grouped).map(
    ([topic, topicSessions]) => {
      const accuracies = topicSessions!.map(
        (s) => (s.correct / s.attempted) * 100,
      );
      const averageAccuracy =
        accuracies.reduce((a, b) => a + b, 0) / accuracies.length;

      return {
        topic: topic as AMCTopic,
        averageAccuracy: Math.round(averageAccuracy),
        sessionCount: topicSessions!.length,
        trend: getPerformanceTrend(topicSessions!),
      };
    },
  );

  // Weakest topics first
  return ranked.sort((a, b) => a.averageAccuracy - b.averageAccuracy);
}

// ─── Mistake Frequency ────────────────────────────────────────────────────────

// Counts how many mistakes exist per topic, sorted by most frequent first.
export function getMistakeFrequencyByTopic(
  mistakes: Mistake[],
): MistakeFrequency[] {
  if (mistakes.length === 0) return [];

  const counts: Partial<Record<AMCTopic, number>> = {};
  for (const mistake of mistakes) {
    counts[mistake.topic] = (counts[mistake.topic] ?? 0) + 1;
  }

  return (Object.entries(counts) as [AMCTopic, number][])
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count);
}

// ─── Performance Delta ────────────────────────────────────────────────────────

// Compares first half of sessions vs second half for a topic.
// Positive = improving, negative = declining.
export function getPerformanceDelta(
  sessions: StudySession[],
  topic: AMCTopic,
): number {
  const topicSessions = sessions
    .filter((s) => s.topic === topic)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

  if (topicSessions.length < 2) return 0;

  const mid = Math.floor(topicSessions.length / 2);
  const firstHalf = topicSessions.slice(0, mid);
  const secondHalf = topicSessions.slice(mid);

  const avg = (s: StudySession[]) =>
    s.reduce((acc, cur) => acc + (cur.correct / cur.attempted) * 100, 0) /
    s.length;

  return Math.round(avg(secondHalf) - avg(firstHalf));
}

// ─── Exam Countdown ───────────────────────────────────────────────────────────

// Returns days remaining until the exam and a status tier, or null if no exam date is set.
export function getExamCountdown(examDate: string | null): ExamCountdown | null {
  if (examDate === null) return null;

  const today = new Date().toISOString().slice(0, 10);
  const msPerDay = 86_400_000;
  const daysRemaining = Math.floor(
    (new Date(examDate).getTime() - new Date(today).getTime()) / msPerDay,
  );

  const status =
    daysRemaining < 7
      ? "urgent"
      : daysRemaining < 30
        ? "getting_close"
        : "on_track";

  return { daysRemaining, status };
}

// ─── Internal Helper ──────────────────────────────────────────────────────────

// Used internally by getRankedWeakTopics to determine trend label.
function getPerformanceTrend(
  sessions: StudySession[],
): "improving" | "declining" | "stable" {
  if (sessions.length < 2) return "stable";

  const sorted = [...sessions].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  const mid = Math.floor(sorted.length / 2);
  const avg = (s: StudySession[]) =>
    s.reduce((acc, cur) => acc + (cur.correct / cur.attempted) * 100, 0) /
    s.length;

  const delta = avg(sorted.slice(mid)) - avg(sorted.slice(0, mid));

  if (delta > 5) return "improving";
  if (delta < -5) return "declining";
  return "stable";
}
