"use client";

import { Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRecentSearches } from "@/lib/hooks/use-recent-searches";

interface RecentSearchesProps {
  onSelect: (query: string) => void;
}

export function RecentSearches({ onSelect }: RecentSearchesProps) {
  const { searches, clearSearches } = useRecentSearches();

  if (searches.length === 0) return null;

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <span className="text-xs text-muted-foreground flex items-center gap-1">
        <Clock className="h-3 w-3" />
        Recent:
      </span>
      {searches.map((s) => (
        <Button
          key={s}
          variant="outline"
          size="xs"
          onClick={() => onSelect(s)}
          className="text-xs"
        >
          {s}
        </Button>
      ))}
      <Button
        variant="ghost"
        size="xs"
        onClick={clearSearches}
        className="text-xs text-muted-foreground"
      >
        <X className="h-3 w-3 mr-1" />
        Clear
      </Button>
    </div>
  );
}
