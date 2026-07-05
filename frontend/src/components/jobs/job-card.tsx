import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { MapPin, Briefcase, IndianRupee, Star } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Job } from "@/generated/prisma/client";
import { JOB_TYPE_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface JobCardProps {
  job: Job;
  className?: string;
}

export function JobCard({ job, className }: JobCardProps) {
  return (
    <Card
      className={cn(
        "group flex h-full flex-col glass-card-enhanced transition-all duration-300 hover:-translate-y-2",
        className
      )}
    >
      <CardContent className="flex flex-1 flex-col gap-5 p-5 pb-4">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {job.featured && (
              <Badge variant="default" className="gap-1 text-xs">
                <Star className="h-3 w-3" />
                Featured
              </Badge>
            )}
            <Badge variant="outline" className="font-mono text-xs">
              {job.searchCode}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {JOB_TYPE_LABELS[job.jobType] || job.jobType}
            </Badge>
          </div>
          <div className="space-y-1.5">
            <p className="truncate text-base font-semibold leading-snug group-hover:text-primary transition-colors">
              {job.companyName}
            </p>
            <h3 className="text-sm leading-relaxed text-muted-foreground">
              {job.role}
            </h3>
          </div>
        </div>

        <div className="space-y-2.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="h-3.5 w-3.5 shrink-0" />
            <span>{job.experience}</span>
          </div>
          {job.salary && (
            <div className="flex items-center gap-2">
              <IndianRupee className="h-3.5 w-3.5 shrink-0" />
              <span>{job.salary}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="mt-auto flex items-center justify-between gap-4 border-t bg-muted/40 px-5 pt-4 pb-4">
        <span
          className="text-xs text-muted-foreground"
          suppressHydrationWarning
        >
          {formatDistanceToNow(new Date(job.postedDate), { addSuffix: true })}
        </span>
        <Button size="sm" nativeButton={false} render={<Link href={`/job/${job.searchCode}`} />}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
