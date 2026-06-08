import type { StudySession, Mistake } from "../types";

export const mockSessions: StudySession[] = [
  {
    id: "1",
    createdAt: "2024-01-01T10:00:00Z",
    topic: "Cardiology",
    attempted: 20,
    correct: 8,
    incorrect: 12,
    notes: "Struggled with ECG interpretation",
  },
  {
    id: "2",
    createdAt: "2024-01-05T10:00:00Z",
    topic: "Cardiology",
    attempted: 20,
    correct: 12,
    incorrect: 8,
    notes: "Better on arrhythmias",
  },
  {
    id: "3",
    createdAt: "2024-01-03T10:00:00Z",
    topic: "Neurology",
    attempted: 15,
    correct: 5,
    incorrect: 10,
    notes: "Confused on stroke management",
  },
  {
    id: "4",
    createdAt: "2024-01-07T10:00:00Z",
    topic: "Pharmacology",
    attempted: 25,
    correct: 20,
    incorrect: 5,
    notes: "Comfortable with drug mechanisms",
  },
];

export const mockMistakes: Mistake[] = [
  {
    id: "1",
    createdAt: "2024-01-01T10:00:00Z",
    topic: "Cardiology",
    questionSummary: "ECG interpretation — narrow complex tachycardia",
    whyWrong: "Confused SVT with AF",
    correctConcept: "SVT is regular, AF is irregularly irregular",
  },
  {
    id: "2",
    createdAt: "2024-01-03T10:00:00Z",
    topic: "Neurology",
    questionSummary: "Acute stroke — thrombolysis window",
    whyWrong: "Thought window was 6 hours",
    correctConcept: "tPA must be given within 4.5 hours of symptom onset",
  },
  {
    id: "3",
    createdAt: "2024-01-03T10:00:00Z",
    topic: "Neurology",
    questionSummary: "Glasgow Coma Scale scoring",
    whyWrong: "Miscounted motor response",
    correctConcept: "Motor response is scored 1-6, not 1-5",
  },
];
