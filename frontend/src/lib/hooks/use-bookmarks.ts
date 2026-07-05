"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "career_snap_bookmarks";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setBookmarks(JSON.parse(stored));
    } catch {
      setBookmarks([]);
    }
    setLoaded(true);
  }, []);

  const save = useCallback((codes: string[]) => {
    setBookmarks(codes);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(codes));
  }, []);

  const toggle = useCallback(
    (searchCode: string) => {
      const next = bookmarks.includes(searchCode)
        ? bookmarks.filter((c) => c !== searchCode)
        : [...bookmarks, searchCode];
      save(next);
      return !bookmarks.includes(searchCode);
    },
    [bookmarks, save]
  );

  const isBookmarked = useCallback(
    (searchCode: string) => bookmarks.includes(searchCode),
    [bookmarks]
  );

  return { bookmarks, toggle, isBookmarked, loaded };
}
