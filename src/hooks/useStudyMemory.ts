import { useState, useEffect, useCallback } from "react";
import type { AIInteraction } from "../types";
import { getRecentAIInteractions } from "../services/storage";

export function useStudyMemory() {
  const [interactions, setInteractions] = useState<AIInteraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getRecentAIInteractions(10);
      setInteractions(data);
    } catch {
      setError("Failed to load interactions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { interactions, loading, error, refetch };
}
