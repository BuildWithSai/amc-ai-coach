import type { RankedTopic, MistakeFrequency } from "../types";

// Takes full analytics picture and returns specific prioritised actions.
// This is the "what should I actually do this week" prompt.
export function buildRecommendationsPrompt(
  weakTopics: RankedTopic[],
  mistakeFrequency: MistakeFrequency[],
): string {
  return `
You are an AI study coach for a doctor preparing for the Australian Medical Council (AMC) MCQ Part 1 exam.

Here is their full performance data:

Weak topics ranked by accuracy (lowest first):
${weakTopics.map((t) => `- ${t.topic}: ${t.averageAccuracy}% accuracy, ${t.sessionCount} sessions, trend: ${t.trend}`).join("\n")}

Mistake frequency by topic:
${mistakeFrequency.map((m) => `- ${m.topic}: ${m.count} mistakes`).join("\n")}

Generate specific, prioritised study recommendations for this week.

Return only valid JSON matching this exact structure. No preamble, no markdown:
{
  "summary": "one sentence overview of what needs the most attention this week",
  "recommendations": [
    {
      "topic": "topic name",
      "action": "specific action to take",
      "rationale": "why this action based on the data",
      "priority": "high | medium | low"
    }
  ]
}
`;
}
