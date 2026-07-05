"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FilterSelect } from "@/components/search/filter-select";
import { SearchResults } from "@/components/search/search-results";
import { RecentSearches } from "@/components/search/recent-searches";
import { useDebouncedSearch } from "@/lib/hooks/use-debounced-search";
import { useRecentSearches } from "@/lib/hooks/use-recent-searches";
import {
  ALL_FILTER_VALUE,
  filterValueToParam,
  JOB_ROLE_OPTIONS,
  JOB_TYPE_FILTER_OPTIONS,
  LOCATION_OPTIONS,
} from "@/lib/filters";
import type { Job } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";

interface InstantSearchProps {
  variant?: "hero" | "compact";
  className?: string;
}

export function InstantSearch({ variant = "hero", className }: InstantSearchProps) {
  const { query, setQuery, debouncedQuery } = useDebouncedSearch(300);
  const { addSearch } = useRecentSearches();
  const [results, setResults] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [jobType, setJobType] = useState(ALL_FILTER_VALUE);
  const [location, setLocation] = useState(ALL_FILTER_VALUE);
  const [role, setRole] = useState(ALL_FILTER_VALUE);
  const [focused, setFocused] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const hasActiveSearch = useMemo(() => {
    return (
      debouncedQuery.trim().length > 0 ||
      filterValueToParam(location).length > 0 ||
      filterValueToParam(role).length > 0 ||
      filterValueToParam(jobType).length > 0
    );
  }, [debouncedQuery, location, role, jobType]);

  const search = useCallback(async () => {
    if (!hasActiveSearch) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedQuery) params.set("q", debouncedQuery);
      const locParam = filterValueToParam(location);
      const roleParam = filterValueToParam(role);
      const typeParam = filterValueToParam(jobType);
      if (typeParam) params.set("jobType", typeParam);
      if (locParam) params.set("location", locParam);
      if (roleParam) params.set("role", roleParam);

      const res = await fetch(`/api/search?${params}`);
      const data = await res.json();
      setResults(data.jobs || []);
      if (debouncedQuery.trim().length >= 2) {
        addSearch(debouncedQuery);
      }
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, jobType, location, role, hasActiveSearch, addSearch]);

  useEffect(() => {
    search();
  }, [search]);

  const isHero = variant === "hero";
  const showResults = (focused || submitted) && hasActiveSearch;

  function handleSearchClick() {
    setSubmitted(true);
    search();
  }

  return (
    <div className={cn("relative w-full", className)}>
      <div
        className={cn(
          "flex flex-col gap-3",
          isHero && "glass-card rounded-2xl p-4 shadow-lg"
        )}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by company, role, search code (CS001), or location..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearchClick();
              }
            }}
            className={cn(
              "pl-10 pr-10",
              isHero ? "h-12 text-base" : "h-10"
            )}
          />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
              onClick={() => setQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>


        {isHero && (
          <Button type="button" onClick={handleSearchClick} className="w-full sm:w-auto gap-2">
            <Search className="h-4 w-4" />
            Search Jobs
          </Button>
        )}
      </div>

      {!showResults && isHero && <RecentSearches onSelect={setQuery} />}

      {showResults && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 rounded-xl border bg-popover shadow-xl overflow-hidden">
          <SearchResults
            results={results}
            loading={loading}
            query={query}
            hasActiveSearch={hasActiveSearch}
          />
        </div>
      )}
    </div>
  );
}
