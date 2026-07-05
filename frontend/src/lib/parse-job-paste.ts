import type { JobFormValues } from "@/lib/validations/job";

const CATEGORIES = [
  "FRESHER",
  "INTERNSHIP",
  "REMOTE",
  "WORK_FROM_HOME",
  "OFF_CAMPUS",
  "EXPERIENCED",
] as const;

const JOB_TYPES = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
  "REMOTE",
] as const;

const LABEL_MAP: Record<string, keyof ParsedJobFields> = {
  "search code": "searchCode",
  "posted date": "postedDate",
  "company name": "companyName",
  role: "role",
  category: "category",
  "job type": "jobType",
  location: "location",
  experience: "experience",
  qualification: "qualification",
  salary: "salary",
  description: "description",
  responsibilities: "responsibilities",
  "responsibilities (one per line)": "responsibilities",
  skills: "skills",
  "skills (comma separated)": "skills",
  "apply link": "applyLink",
  featured: "featured",
  trending: "trending",
};

type ParsedJobFields = {
  searchCode?: string;
  postedDate?: string;
  companyName?: string;
  role?: string;
  category?: JobFormValues["category"];
  jobType?: JobFormValues["jobType"];
  location?: string;
  experience?: string;
  qualification?: string;
  salary?: string;
  description?: string;
  responsibilities?: string;
  skills?: string;
  applyLink?: string;
  featured?: boolean;
  trending?: boolean;
};

export type ParseJobPasteResult = {
  fields: ParsedJobFields;
  filled: string[];
  warnings: string[];
};

function parseSections(text: string): Record<string, string> {
  const sections: Record<string, string> = {};
  const regex = /\*\*(.+?):\*\*\s*([\s\S]*?)(?=\n\*\*|$)/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const label = match[1].trim().toLowerCase();
    const value = match[2].trim();
    if (value) sections[label] = value;
  }

  return sections;
}

function normalizeEnum<T extends string>(value: string, allowed: readonly T[]): T | undefined {
  const normalized = value.toUpperCase().replace(/\s+/g, "_") as T;
  return allowed.includes(normalized) ? normalized : undefined;
}

function parseToggle(value: string): boolean | undefined {
  const v = value.trim().toUpperCase();
  if (["ON", "YES", "TRUE", "1"].includes(v)) return true;
  if (["OFF", "NO", "FALSE", "0"].includes(v)) return false;
  return undefined;
}

function parsePostedDate(value: string): string | undefined {
  const trimmed = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().split("T")[0];
  }

  return undefined;
}

export function parseJobPaste(text: string): ParseJobPasteResult {
  const sections = parseSections(text);
  const fields: ParsedJobFields = {};
  const filled: string[] = [];
  const warnings: string[] = [];

  for (const [label, value] of Object.entries(sections)) {
    const field = LABEL_MAP[label];
    if (!field) continue;

    switch (field) {
      case "category": {
        const category = normalizeEnum(value, CATEGORIES);
        if (category) {
          fields.category = category;
          filled.push("Category");
        } else {
          warnings.push(`Invalid category: "${value}"`);
        }
        break;
      }
      case "jobType": {
        const jobType = normalizeEnum(value, JOB_TYPES);
        if (jobType) {
          fields.jobType = jobType;
          filled.push("Job Type");
        } else {
          warnings.push(`Invalid job type: "${value}"`);
        }
        break;
      }
      case "featured": {
        const featured = parseToggle(value);
        if (featured !== undefined) {
          fields.featured = featured;
          filled.push("Featured");
        } else {
          warnings.push(`Invalid featured value: "${value}" (use ON or OFF)`);
        }
        break;
      }
      case "trending": {
        const trending = parseToggle(value);
        if (trending !== undefined) {
          fields.trending = trending;
          filled.push("Trending");
        } else {
          warnings.push(`Invalid trending value: "${value}" (use ON or OFF)`);
        }
        break;
      }
      case "postedDate": {
        const postedDate = parsePostedDate(value);
        if (postedDate) {
          fields.postedDate = postedDate;
          filled.push("Posted Date");
        } else {
          warnings.push(`Invalid posted date: "${value}"`);
        }
        break;
      }
      default:
        fields[field] = value;
        filled.push(
          field === "searchCode"
            ? "Search Code"
            : field === "companyName"
              ? "Company Name"
              : field === "applyLink"
                ? "Apply Link"
                : field.charAt(0).toUpperCase() + field.slice(1)
        );
    }
  }

  if (filled.length === 0) {
    warnings.push("No fields found. Use **Label:** format (e.g. **Company Name:**)");
  }

  return { fields, filled, warnings };
}

export const JOB_PASTE_TEMPLATE = `**Search Code:**
CS006

**Company Name:**
AngelOne

**Role:**
SDE Intern

**Category:**
FRESHER

**Job Type:**
INTERNSHIP

**Location:**
Bangalore, India

**Experience:**
0 Years

**Qualification:**
B.E / B.Tech (2026, 2027 & 2028 Graduates)

**Salary:**
Not Disclosed

**Description:**
AngelOne is hiring SDE Interns for the 2026, 2027, and 2028 graduating batches.

**Responsibilities (one per line):**
Develop and maintain software applications
Write clean and efficient code
Debug and fix software issues

**Skills (comma separated):**
Java, C++, Python, Data Structures, Algorithms

**Apply Link:**
https://example.com/apply

**Featured:** OFF

**Trending:** ON`;
