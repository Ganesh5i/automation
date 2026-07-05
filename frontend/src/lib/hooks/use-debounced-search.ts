"use client";

import { useState, useEffect, useCallback } from "react";

export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export function useDebouncedSearch(delay = 300) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, delay);

  const reset = useCallback(() => setQuery(""), []);

  return { query, setQuery, debouncedQuery, reset };
}
