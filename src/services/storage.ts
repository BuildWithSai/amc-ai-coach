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
  return data as StudySession[];
}

export async function saveSession(session: StudySession): Promise<void> {
  const { error } = await supabase.from("study_sessions").insert({
    id: session.id,
    topic: session.topic,
    attempted: session.attempted,
    correct: session.correct,
    incorrect: session.incorrect,
    notes: session.notes,
    created_at: session.created_at,
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
  return data as Mistake[];
}

export async function saveMistake(mistake: Mistake): Promise<void> {
  const { error } = await supabase.from("mistakes").insert({
    id: mistake.id,
    topic: mistake.topic,
    question_summary: mistake.question_summary,
    why_wrong: mistake.why_wrong,
    correct_concept: mistake.correct_concept,
    created_at: mistake.created_at,
  });
  if (error) console.error("saveMistake error:", error);
}
