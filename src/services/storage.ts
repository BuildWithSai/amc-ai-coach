/**
 * Reads and writes study sessions and mistakes to Supabase.
 * Maps camelCase TS fields to snake_case DB columns on write, and back on read.
 * Errors are logged to the console; functions never throw to the caller.
 */
import type { StudySession, Mistake } from "../types";
import { supabase } from "./supabase";

export async function getSessions(): Promise<StudySession[]> {
  const { data, error } = await supabase
    .from("study_sessions")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) {
    console.error("getSessions error:", error);
    return [];
  }
  return (data ?? []).map((row) => ({
    id: row.id,
    topic: row.topic,
    attempted: row.attempted,
    correct: row.correct,
    incorrect: row.incorrect,
    notes: row.notes,
    createdAt: row.created_at,
  })) as StudySession[];
}

export async function saveSession(session: StudySession): Promise<void> {
  const { error } = await supabase.from("study_sessions").insert({
    id: session.id,
    topic: session.topic,
    attempted: session.attempted,
    correct: session.correct,
    incorrect: session.incorrect,
    notes: session.notes,
    created_at: session.createdAt,
  });
  if (error) console.error("saveSession error:", error);
}

export async function getMistakes(): Promise<Mistake[]> {
  const { data, error } = await supabase
    .from("mistakes")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) {
    console.error("getMistakes error:", error);
    return [];
  }
  return (data ?? []).map((row) => ({
    id: row.id,
    topic: row.topic,
    questionSummary: row.question_summary,
    whyWrong: row.why_wrong,
    correctConcept: row.correct_concept,
    createdAt: row.created_at,
  })) as Mistake[];
}

export async function saveMistake(mistake: Mistake): Promise<void> {
  const { error } = await supabase.from("mistakes").insert({
    id: mistake.id,
    topic: mistake.topic,
    question_summary: mistake.questionSummary,
    why_wrong: mistake.whyWrong,
    correct_concept: mistake.correctConcept,
    created_at: mistake.createdAt,
  });
  if (error) console.error("saveMistake error:", error);
}
