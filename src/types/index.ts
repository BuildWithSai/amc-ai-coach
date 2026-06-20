export type AMCTopic =
  | "Cardiology"
  | "Respiratory Medicine"
  | "Gastroenterology"
  | "Neurology"
  | "Obstetrics & Gynaecology"
  | "Paediatrics"
  | "Psychiatry"
  | "Surgery"
  | "Pharmacology"
  | "Endocrinology"
  | "Infectious Diseases"
  | "Renal Medicine"
  | "Musculoskeletal"
  | "Dermatology"
  | "Haematology";

export interface StudySession {
  id: string;
  createdAt: string;
  topic: AMCTopic;
  attempted: number;
  correct: number;
  incorrect: number;
  notes?: string;
}

export interface Mistake {
  id: string;
  createdAt: string;
  topic: AMCTopic;
  questionSummary: string;
  whyWrong: string;
  correctConcept: string;
}

export interface RankedTopic {
  topic: AMCTopic;
  averageAccuracy: number;
  sessionCount: number;
  trend: "improving" | "declining" | "stable";
}

export interface MistakeFrequency {
  topic: AMCTopic;
  count: number;
}

export interface AIInteraction {
  id: string;
  insightType: string;
  summary: string;
  response: unknown;
  rating: "helpful" | "not_helpful" | null;
  createdAt: string;
}