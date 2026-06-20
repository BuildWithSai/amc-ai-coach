import { useState, useEffect, useCallback } from "react";
import type { Mistake } from "../types";
import { getMistakes } from "../services/storage";

export function useMistakes() {
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMistakes();
      setMistakes(data);
    } catch {
      setError("Failed to load mistakes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { mistakes, loading, error, refetch };
}