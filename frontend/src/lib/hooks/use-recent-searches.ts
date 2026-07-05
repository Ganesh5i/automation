"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "career_snap_recent_searches";
const MAX_ITEMS = 5;

export function useRecentSearches() {
  const [searches, setSearches] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setSearches(JSON.parse(stored));
    } catch {
      setSearches([]);
    }
  }, []);

  const addSearch = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) return;

    setSearches((prev) => {
      const filtered = prev.filter(
        (s) => s.toLowerCase() !== trimmed.toLowerCase()
      );
      const next = [trimmed, ...filtered].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearSearches = useCallback(() => {
    setSearches([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { searches, addSearch, clearSearches };
}
