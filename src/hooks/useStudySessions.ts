import { useState, useEffect, useCallback } from "react";
import type { StudySession } from "../types";
import { getSessions } from "../services/storage";

export function useStudySessions() {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getSessions();
      setSessions(data);
    } catch {
      setError("Failed to load sessions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { sessions, loading, error, refetch };
}