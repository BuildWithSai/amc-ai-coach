/**
 * Reads and writes study sessions and mistakes to Supabase.
 * Maps camelCase TS fields to snake_case DB columns on write, and back on read.
 * Errors are logged to the console; functions never throw to the caller.
 */
import type {
  StudySession,
  Mistake,
  AIInteraction,
  UserProfile,
} from "../types";
import { supabase } from "./supabase";

export async function getSessions(): Promise<StudySession[]> {
  const { data, error } = await supabase
    .from("study_sessions")
    .select("*")
    .order("created_at", { ascending: true })
    .eq("user_id", (await supabase.auth.getUser()).data.user?.id ?? "");
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
    durationMinutes: row.duration_minutes,
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
    duration_minutes: session.durationMinutes,
    created_at: session.createdAt,
    user_id: (await supabase.auth.getUser()).data.user?.id,
  });
  if (error) console.error("saveSession error:", error);
}

export async function getMistakes(): Promise<Mistake[]> {
  const { data, error } = await supabase
    .from("mistakes")
    .select("*")
    .order("created_at", { ascending: true })
    .eq("user_id", (await supabase.auth.getUser()).data.user?.id ?? "");
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
    user_id: (await supabase.auth.getUser()).data.user?.id,
  });
  if (error) console.error("saveMistake error:", error);
}

export async function saveAIInteraction(
  interaction: AIInteraction,
): Promise<void> {
  const { error } = await supabase.from("ai_interactions").insert({
    id: interaction.id,
    insight_type: interaction.insightType,
    summary: interaction.summary,
    response: interaction.response,
    rating: interaction.rating,
    created_at: interaction.createdAt,
    user_id: (await supabase.auth.getUser()).data.user?.id,
  });
  if (error) console.error("saveAIInteraction error:", error);
}

export async function getRecentAIInteractions(
  limit: number,
): Promise<AIInteraction[]> {
  const { data, error } = await supabase
    .from("ai_interactions")
    .select("*")
    .eq("user_id", (await supabase.auth.getUser()).data.user?.id ?? "")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("getRecentAIInteractions error:", error);
    return [];
  }
  return data.map((row) => ({
    id: row.id,
    insightType: row.insight_type,
    summary: row.summary,
    response: row.response,
    rating: row.rating,
    createdAt: row.created_at,
  }));
}

export async function getUserProfile(): Promise<UserProfile | null> {
  const userId = (await supabase.auth.getUser()).data.user?.id;
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", userId ?? "")
    .maybeSingle();
  if (error) {
    console.error("getUserProfile error:", error);
    return null;
  }
  if (!data) return null;
  return {
    examDate: data.exam_date,
    weeklyHours: data.weekly_hours,
    updatedAt: data.updated_at,
  };
}

export async function saveUserProfile(
  examDate: string | null,
  weeklyHours: number | null,
): Promise<void> {
  const userId = (await supabase.auth.getUser()).data.user?.id;
  const { error } = await supabase.from("user_profiles").upsert({
    user_id: userId,
    exam_date: examDate,
    weekly_hours: weeklyHours,
    updated_at: new Date().toISOString(),
  });
  if (error) console.error("saveUserProfile error:", error);
}
