import { z } from "zod";

export const companySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  slug: z.string().min(1, "Slug is required"),
  logo: z.string().optional(),
  description: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
});

export type CompanyFormValues = z.infer<typeof companySchema>;

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
