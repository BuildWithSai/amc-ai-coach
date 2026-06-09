// aiFeedback.ts — tracks whether AI insights are actually useful.
// This data tells you which prompts to improve over time.

const FEEDBACK_KEY = "amc_ai_feedback";

export interface AIFeedbackEntry {
  insightType: string;
  timestamp: string;
  rating: "helpful" | "not_helpful";
}

export function saveAIFeedback(entry: AIFeedbackEntry): void {
  const existing = getFeedbackEntries();
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify([...existing, entry]));
}

export function getFeedbackEntries(): AIFeedbackEntry[] {
  const raw = localStorage.getItem(FEEDBACK_KEY);
  if (!raw) return [];
  return JSON.parse(raw) as AIFeedbackEntry[];
}

// Returns a summary — useful for the README and for your own prompt iteration
export function getFeedbackSummary(): { helpful: number; notHelpful: number } {
  const entries = getFeedbackEntries();
  return {
    helpful: entries.filter((e) => e.rating === "helpful").length,
    notHelpful: entries.filter((e) => e.rating === "not_helpful").length,
  };
}
