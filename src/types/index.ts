// Shape of a study session saved by the user
export type StudySession = {
  topic: string;
  attempted: string;
  correct: string;
  incorrect: string;
  notes: string;
};

// Shape of a mistake recorded by the user
export type Mistake = {
  topic: string;
  questionSummary: string;
  whyWrong: string;
  correctConcept: string;
};
