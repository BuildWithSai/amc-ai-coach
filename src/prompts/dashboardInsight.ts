import type { RankedTopic, MistakeFrequency } from "../types";

// Prompt function — takes pre-computed analytics, returns a prompt string.
// Never accepts raw session data — only computed results.
export function buildDashboardInsightPrompt(
  weakTopics: RankedTopic[],
  mistakeFrequency: MistakeFrequency[],
): string {
  const top = weakTopics[0];

  return `
You are an AI study coach for a doctor preparing for the Australian Medical Council (AMC) MCQ Part 1 exam.

Here is their current performance data:

Weak topics ranked by accuracy (lowest first):
${weakTopics.map((t) => `- ${t.topic}: ${t.averageAccuracy}% accuracy, ${t.sessionCount} sessions, trend: ${t.trend}`).join("\n")}

Mistake frequency by topic:
${mistakeFrequency.map((m) => `- ${m.topic}: ${m.count} mistakes`).join("\n")}

Based on this data, generate a single dashboard insight focused on the most urgent topic: ${top.topic}.

Return only valid JSON matching this exact structure. No preamble, no markdown:
{
  "headline": "one sentence, urgent and specific",
  "detail": "2-3 sentences explaining why this topic needs attention",
  "evidence": {
    "topic": "${top.topic}",
    "accuracy": ${top.averageAccuracy},
    "trend": "${top.trend}"
  },
  "urgency": "high | medium | low",
  "actionLabel": "short action e.g. Review stroke protocols"
}
`;
}
