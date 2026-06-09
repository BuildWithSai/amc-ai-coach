import type { MistakeFrequency } from "../types";
import type { Mistake } from "../types";

// Takes raw mistakes and frequency data to find recurring patterns.
// GPT looks for themes in why questions were answered incorrectly.
export function buildMistakePatternAnalysisPrompt(
  mistakes: Mistake[],
  mistakeFrequency: MistakeFrequency[],
): string {
  return `
You are an AI study coach for a doctor preparing for the Australian Medical Council (AMC) MCQ Part 1 exam.

Here is their mistake data:

Mistake frequency by topic:
${mistakeFrequency.map((m) => `- ${m.topic}: ${m.count} mistakes`).join("\n")}

Recent mistakes:
${mistakes.map((m) => `- ${m.topic}: ${m.questionSummary} | Why wrong: ${m.whyWrong} | Correct concept: ${m.correctConcept}`).join("\n")}

Identify recurring patterns in why this student gets questions wrong.

Return only valid JSON matching this exact structure. No preamble, no markdown:
{
  "topPattern": "one sentence describing the most common mistake pattern",
  "patterns": [
    {
      "topic": "topic name",
      "pattern": "what keeps going wrong in this topic",
      "frequency": 0,
      "suggestedFix": "specific action to fix this pattern"
    }
  ],
  "confidence": "high | medium | low"
}
`;
}
