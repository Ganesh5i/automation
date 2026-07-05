import { z } from "zod";

export const jobSchema = z.object({
  searchCode: z
    .string()
    .max(30, "Search code must be 30 characters or less")
    .regex(
      /^[A-Za-z0-9_-]*$/,
      "Search code can only contain letters, numbers, hyphens, and underscores"
    )
    .optional(),
  postedDate: z.string().optional(),
  companyName: z.string().min(1, "Company name is required"),
  companyLogo: z.string().optional(),
  companyId: z.string().optional(),
  role: z.string().min(1, "Role is required"),
  category: z.enum([
    "FRESHER",
    "INTERNSHIP",
    "REMOTE",
    "WORK_FROM_HOME",
    "OFF_CAMPUS",
    "EXPERIENCED",
  ]),
  jobType: z.enum([
    "FULL_TIME",
    "PART_TIME",
    "CONTRACT",
    "INTERNSHIP",
    "REMOTE",
  ]),
  location: z.string().min(1, "Location is required"),
  experience: z.string().min(1, "Experience is required"),
  qualification: z.string().optional(),
  salary: z.string().optional(),
  description: z.string().min(10, "Description is required"),
  responsibilities: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
  applyLink: z.string().url("Valid apply link is required"),
  featured: z.boolean().default(false),
  trending: z.boolean().default(false),
});

export type JobFormValues = z.infer<typeof jobSchema>;
