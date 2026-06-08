import type { RankedTopic, MistakeFrequency } from "../types";

// Takes all weak topics and mistake data.
// Returns a detailed breakdown — not just what's weak, but why and what to do.
export function buildWeakTopicAnalysisPrompt(
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

Analyse each weak topic and explain why it is weak and what the student should do about it.

Return only valid JSON matching this exact structure. No preamble, no markdown:
{
  "topInsight": "one sentence summary of the biggest problem",
  "weakTopics": [
    {
      "topic": "topic name",
      "reason": "why this topic is weak based on the data",
      "evidence": {
        "accuracy": 0,
        "mistakeCount": 0,
        "trend": "stable | improving | declining"
      },
      "priority": "high | medium | low",
      "suggestedAction": "specific action to improve this topic"
    }
  ],
  "overallTrend": "stable | improving | declining",
  "confidence": "high | medium | low"
}
`;
}
