import type { AMCTopic } from "./index";

// Every AI response is typed before we write a single prompt.
// If the AI returns something unexpected, TypeScript catches it immediately.

export interface DashboardInsightResponse {
  headline: string;
  detail: string;
  evidence: {
    topic: AMCTopic;
    accuracy: number;
    trend: "improving" | "declining" | "stable";
  };
  urgency: "high" | "medium" | "low";
  actionLabel: string;
}

export interface WeakTopicAnalysisResponse {
  topInsight: string;
  weakTopics: {
    topic: AMCTopic;
    reason: string;
    evidence: {
      accuracy: number;
      mistakeCount: number;
      trend: "improving" | "declining" | "stable";
    };
    priority: "high" | "medium" | "low";
    suggestedAction: string;
  }[];
  overallTrend: "improving" | "declining" | "stable";
  confidence: "high" | "medium" | "low";
}

export interface MistakePatternResponse {
  topPattern: string;
  patterns: {
    topic: AMCTopic;
    pattern: string;
    frequency: number;
    suggestedFix: string;
  }[];
  confidence: "high" | "medium" | "low";
}

export interface RecommendationResponse {
  summary: string;
  recommendations: {
    topic: AMCTopic;
    action: string;
    rationale: string;
    priority: "high" | "medium" | "low";
  }[];
}
