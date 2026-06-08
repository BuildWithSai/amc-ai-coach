import type { StudySession, Mistake } from "../types";

const SESSIONS_KEY = "amc_sessions";
const MISTAKES_KEY = "amc_mistakes";

export function getSessions(): StudySession[] {
  const raw = localStorage.getItem(SESSIONS_KEY);
  if (!raw) return [];
  return JSON.parse(raw) as StudySession[];
}

export function saveSession(session: StudySession): void {
  const existing = getSessions();
  localStorage.setItem(SESSIONS_KEY, JSON.stringify([...existing, session]));
}

export function getMistakes(): Mistake[] {
  const raw = localStorage.getItem(MISTAKES_KEY);
  if (!raw) return [];
  return JSON.parse(raw) as Mistake[];
}

export function saveMistake(mistake: Mistake): void {
  const existing = getMistakes();
  localStorage.setItem(MISTAKES_KEY, JSON.stringify([...existing, mistake]));
}
