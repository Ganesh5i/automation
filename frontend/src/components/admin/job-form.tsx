"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobSchema, type JobFormValues } from "@/lib/validations/job";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LogoUpload } from "@/components/admin/logo-upload";
import { toast } from "sonner";
import { ClipboardPaste } from "lucide-react";
import { JOB_PASTE_TEMPLATE, parseJobPaste } from "@/lib/parse-job-paste";
import type { Job } from "@/generated/prisma/client";

interface JobFormProps {
  job?: Job;
  nextSearchCode?: string;
}

export function JobForm({ job, nextSearchCode }: JobFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [skillsInput, setSkillsInput] = useState(job?.skills.join(", ") || "");
  const [respInput, setRespInput] = useState(
    job?.responsibilities.join("\n") || ""
  );
  const [pasteText, setPasteText] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema) as Resolver<JobFormValues>,
    defaultValues: job
      ? {
          searchCode: job.searchCode,
          postedDate: new Date(job.postedDate).toISOString().split("T")[0],
          companyName: job.companyName,
          companyLogo: job.companyLogo || "",
          role: job.role,
          category: job.category,
          jobType: job.jobType,
          location: job.location,
          experience: job.experience,
          qualification: job.qualification || "",
          salary: job.salary || "",
          description: job.description,
          applyLink: job.applyLink,
          featured: job.featured,
          trending: job.trending,
          responsibilities: job.responsibilities,
          skills: job.skills,
        }
      : {
          searchCode: nextSearchCode || "",
          postedDate: new Date().toISOString().split("T")[0],
          category: "FRESHER",
          jobType: "FULL_TIME",
          featured: false,
          trending: false,
          responsibilities: [],
          skills: [],
        },
  });

  const companyLogo = watch("companyLogo");
  const featured = watch("featured");
  const trending = watch("trending");

  const handleFillFromPaste = () => {
    if (!pasteText.trim()) {
      toast.error("Paste your job details first");
      return;
    }

    const { fields, filled, warnings } = parseJobPaste(pasteText);

    if (fields.searchCode) setValue("searchCode", fields.searchCode);
    if (fields.postedDate) setValue("postedDate", fields.postedDate);
    if (fields.companyName) setValue("companyName", fields.companyName);
    if (fields.role) setValue("role", fields.role);
    if (fields.category) setValue("category", fields.category);
    if (fields.jobType) setValue("jobType", fields.jobType);
    if (fields.location) setValue("location", fields.location);
    if (fields.experience) setValue("experience", fields.experience);
    if (fields.qualification) setValue("qualification", fields.qualification);
    if (fields.salary) setValue("salary", fields.salary);
    if (fields.description) setValue("description", fields.description);
    if (fields.applyLink) setValue("applyLink", fields.applyLink);
    if (fields.featured !== undefined) setValue("featured", fields.featured);
    if (fields.trending !== undefined) setValue("trending", fields.trending);
    if (fields.responsibilities) setRespInput(fields.responsibilities);
    if (fields.skills) setSkillsInput(fields.skills);

    if (filled.length > 0) {
      toast.success(`Filled ${filled.length} field${filled.length === 1 ? "" : "s"}`);
    }
    for (const warning of warnings) {
      toast.warning(warning);
    }
  };

  const onSubmit = async (data: JobFormValues) => {
    setLoading(true);
    const payload = {
      ...data,
      skills: skillsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      responsibilities: respInput
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      const url = job ? `/api/admin/jobs/${job.id}` : "/api/admin/jobs";
      const method = job ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to save");
      toast.success(job ? "Job updated" : "Job created");
      router.push("/admin/jobs");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <div className="rounded-lg border border-dashed p-4 space-y-3 bg-muted/30">
        <div className="flex items-center justify-between gap-2">
          <Label className="text-base font-semibold">Quick Paste</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={() => setPasteText(JOB_PASTE_TEMPLATE)}
          >
            Load template
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Paste job details using <code className="text-xs">**Label:**</code> format, then
          click Fill Form.
        </p>
        <Textarea
          value={pasteText}
          onChange={(e) => setPasteText(e.target.value)}
          rows={6}
          placeholder="**Search Code:**&#10;CS006&#10;&#10;**Company Name:**&#10;AngelOne&#10;..."
          className="font-mono text-xs"
        />
        <Button type="button" variant="secondary" onClick={handleFillFromPaste}>
          <ClipboardPaste className="size-4" />
          Fill Form
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Search Code *</Label>
          <Input
            {...register("searchCode")}
            className="font-mono mt-1"
            placeholder="e.g. CS001, GOOGLE-INT"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Users can search by this code or keyword on the website.
          </p>
          {errors.searchCode && (
            <p className="text-xs text-destructive mt-1">{errors.searchCode.message}</p>
          )}
        </div>
        <div>
          <Label>Posted Date</Label>
          <Input {...register("postedDate")} type="date" className="mt-1" />
          <p className="text-xs text-muted-foreground mt-1">
            Set when the job appears to have been posted. Use an earlier date to announce ahead.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Company Name *</Label>
          <Input {...register("companyName")} className="mt-1" />
          {errors.companyName && (
            <p className="text-xs text-destructive mt-1">{errors.companyName.message}</p>
          )}
        </div>
        <div>
          <Label>Role *</Label>
          <Input {...register("role")} className="mt-1" />
          {errors.role && (
            <p className="text-xs text-destructive mt-1">{errors.role.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label>Company Logo</Label>
        <div className="mt-1">
          <LogoUpload
            value={companyLogo}
            onChange={(url) => setValue("companyLogo", url)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Category *</Label>
          <Select
            value={watch("category")}
            onValueChange={(v) => v && setValue("category", v as JobFormValues["category"])}
          >
            <SelectTrigger className="mt-1 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["FRESHER", "INTERNSHIP", "REMOTE", "WORK_FROM_HOME", "OFF_CAMPUS", "EXPERIENCED"].map(
                (c) => (
                  <SelectItem key={c} value={c}>
                    {c.replace(/_/g, " ")}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Job Type *</Label>
          <Select
            value={watch("jobType")}
            onValueChange={(v) => v && setValue("jobType", v as JobFormValues["jobType"])}
          >
            <SelectTrigger className="mt-1 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "REMOTE"].map((t) => (
                <SelectItem key={t} value={t}>
                  {t.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Location *</Label>
          <Input {...register("location")} className="mt-1" />
        </div>
        <div>
          <Label>Experience *</Label>
          <Input {...register("experience")} className="mt-1" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Qualification</Label>
          <Input {...register("qualification")} className="mt-1" />
        </div>
        <div>
          <Label>Salary</Label>
          <Input {...register("salary")} className="mt-1" />
        </div>
      </div>

      <div>
        <Label>Description *</Label>
        <Textarea {...register("description")} rows={5} className="mt-1" />
      </div>

      <div>
        <Label>Responsibilities (one per line)</Label>
        <Textarea
          value={respInput}
          onChange={(e) => setRespInput(e.target.value)}
          rows={4}
          className="mt-1"
        />
      </div>

      <div>
        <Label>Skills (comma separated)</Label>
        <Input
          value={skillsInput}
          onChange={(e) => setSkillsInput(e.target.value)}
          className="mt-1"
          placeholder="React, TypeScript, Node.js"
        />
      </div>

      <div>
        <Label>Apply Link *</Label>
        <Input {...register("applyLink")} type="url" className="mt-1" />
      </div>

      <div className="flex gap-6">
        <div className="flex items-center gap-2">
          <Switch checked={featured} onCheckedChange={(v) => setValue("featured", v)} />
          <Label>Featured</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={trending} onCheckedChange={(v) => setValue("trending", v)} />
          <Label>Trending</Label>
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : job ? "Update Job" : "Create Job"}
      </Button>
    </form>
  );
}
