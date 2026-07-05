import { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { SITE_URL } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const jobs = await db.job.findMany({
    select: { searchCode: true, postedDate: true },
    orderBy: { postedDate: "desc" },
  });

  const companies = await db.company.findMany({
    select: { slug: true, updatedAt: true },
  });

  const staticPages = [
    "",
    "/jobs",
    "/internships",
    "/remote-jobs",
    "/work-from-home",
    "/off-campus",
    "/experienced",
    "/companies",
    "/about",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const jobPages = jobs.map((job) => ({
    url: `${SITE_URL}/job/${job.searchCode}`,
    lastModified: job.postedDate,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const companyPages = companies.map((c) => ({
    url: `${SITE_URL}/companies/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...jobPages, ...companyPages];
}
