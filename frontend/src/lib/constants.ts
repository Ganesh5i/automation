import type { JobCategory } from "@/generated/prisma/client";

export const SITE_NAME = "career__snap";
export const SITE_TAGLINE = "Discover Your Next Career Opportunity";
export const SITE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";
export const JOBS_PER_PAGE = 12;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/jobs", label: "Jobs" },
  { href: "/internships", label: "Internships" },
  { href: "/remote-jobs", label: "Remote Jobs" },
  { href: "/companies", label: "Companies" },
  { href: "/about", label: "About" },
] as const;

export const CATEGORY_CONFIG: Record<
  JobCategory,
  { label: string; href: string; description: string }
> = {
  FRESHER: {
    label: "Fresher Jobs",
    href: "/jobs",
    description: "Entry-level opportunities for fresh graduates",
  },
  INTERNSHIP: {
    label: "Internships",
    href: "/internships",
    description: "Internship programs across top companies",
  },
  REMOTE: {
    label: "Remote Jobs",
    href: "/remote-jobs",
    description: "Work from anywhere with remote positions",
  },
  WORK_FROM_HOME: {
    label: "Work From Home",
    href: "/work-from-home",
    description: "Flexible WFH opportunities",
  },
  OFF_CAMPUS: {
    label: "Off Campus Drives",
    href: "/off-campus",
    description: "Off-campus hiring drives and walk-ins",
  },
  EXPERIENCED: {
    label: "Experienced Jobs",
    href: "/experienced",
    description: "Roles for experienced professionals",
  },
};

export const JOB_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
  REMOTE: "Remote",
};
