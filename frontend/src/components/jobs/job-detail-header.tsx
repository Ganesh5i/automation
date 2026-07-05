import { format } from "date-fns";
import { MapPin, Briefcase, IndianRupee, GraduationCap, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Job } from "@/generated/prisma/client";
import { JOB_TYPE_LABELS } from "@/lib/constants";

interface JobDetailHeaderProps {
  job: Job;
}

export function JobDetailHeader({ job }: JobDetailHeaderProps) {
  return (
    <div className="glass-card rounded-2xl p-6 md:p-8">
      <div className="flex-1">
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline" className="font-mono">
            {job.searchCode}
          </Badge>
          <Badge variant="secondary">
            {JOB_TYPE_LABELS[job.jobType] || job.jobType}
          </Badge>
          {job.featured && (
            <Badge className="gap-1">
              <Star className="h-3 w-3" />
              Featured
            </Badge>
          )}
        </div>
        <h1 className="text-2xl md:text-3xl font-bold">{job.role}</h1>
        <p className="text-lg text-muted-foreground mt-1">{job.companyName}</p>
        <p className="text-sm text-muted-foreground mt-2">
          Posted {format(new Date(job.postedDate), "MMMM d, yyyy")}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0 text-primary" />
            {job.location}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Briefcase className="h-4 w-4 shrink-0 text-primary" />
            {job.experience}
          </div>
          {job.qualification && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <GraduationCap className="h-4 w-4 shrink-0 text-primary" />
              {job.qualification}
            </div>
          )}
          {job.salary && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <IndianRupee className="h-4 w-4 shrink-0 text-primary" />
              {job.salary}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
