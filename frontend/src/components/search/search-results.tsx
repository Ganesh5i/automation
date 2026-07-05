"use client";

import Link from "next/link";
import { MapPin, Building2 } from "lucide-react";
import type { Job } from "@/generated/prisma/client";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/search/empty-state";

interface SearchResultsProps {
  results: Job[];
  loading: boolean;
  query: string;
  hasActiveSearch?: boolean;
  onSelect?: (job: Job) => void;
}

export function SearchResults({
  results,
  loading,
  query,
  hasActiveSearch = false,
  onSelect,
}: SearchResultsProps) {
  if (loading) {
    return (
      <div className="space-y-2 p-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-3 p-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!hasActiveSearch) return null;

  if (results.length === 0) {
    return (
      <div className="p-4">
        <EmptyState
          title="No matching jobs"
          description={
            query.trim()
              ? `No results for "${query}". Try a search code like CS001, another role, or a different location.`
              : "No jobs match your filters. Try a different location, role, or job type."
          }
        />
      </div>
    );
  }

  return (
    <ul className="divide-y max-h-80 overflow-y-auto">
      {results.map((job) => (
        <li key={job.id}>
          <Link
            href={`/job/${job.searchCode}`}
            onClick={() => onSelect?.(job)}
            className="flex items-start gap-3 p-3 hover:bg-accent transition-colors"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-sm truncate">{job.role}</p>
                <Badge variant="outline" className="text-xs font-mono shrink-0">
                  {job.searchCode}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{job.companyName}</p>
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {job.location}
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
