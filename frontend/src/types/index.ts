import type { Job, Company, JobCategory, JobType } from "@/generated/prisma/client";

export type { Job, Company, JobCategory, JobType };

export type JobWithCompany = Job & {
  company: Company | null;
};

export type CompanyWithCount = Company & {
  _count: { jobs: number };
};

export type SearchParams = {
  q?: string;
  category?: string;
  jobType?: string;
  location?: string;
  role?: string;
  page?: string;
};
