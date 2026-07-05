"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { FilterSelect } from "@/components/search/filter-select";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import {
  filterValueToParam,
  JOB_ROLE_OPTIONS,
  JOB_TYPE_FILTER_OPTIONS,
  LOCATION_OPTIONS,
  paramToFilterValue,
} from "@/lib/filters";

export function JobFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const location = paramToFilterValue(searchParams.get("location"));
  const role = paramToFilterValue(searchParams.get("role"));
  const jobType = paramToFilterValue(searchParams.get("jobType"));

  function applyFilters() {
    const params = new URLSearchParams();
    const loc = filterValueToParam(location);
    const roleVal = filterValueToParam(role);
    const type = filterValueToParam(jobType);
    if (loc) params.set("location", loc);
    if (roleVal) params.set("role", roleVal);
    if (type) params.set("jobType", type);
    router.push(`${pathname}?${params.toString()}`);
  }

  function setFilter(key: "location" | "role" | "jobType", value: string) {
    const params = new URLSearchParams(searchParams.toString());
    const paramVal = filterValueToParam(value);
    if (paramVal) {
      params.set(key, paramVal);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="glass-card rounded-xl p-4 mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FilterSelect
          value={role}
          onValueChange={(v) => setFilter("role", v)}
          options={JOB_ROLE_OPTIONS}
          placeholder="Job Role"
        />
        <FilterSelect
          value={location}
          onValueChange={(v) => setFilter("location", v)}
          options={LOCATION_OPTIONS}
          placeholder="District / Location"
        />
        <FilterSelect
          value={jobType}
          onValueChange={(v) => setFilter("jobType", v)}
          options={JOB_TYPE_FILTER_OPTIONS}
          placeholder="Job Type"
        />
        <Button type="button" onClick={applyFilters} className="gap-2">
          <Search className="h-4 w-4" />
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
