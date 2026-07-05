import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function JobCardSkeleton() {
  return (
    <Card className="flex h-full flex-col glass-card">
      <CardContent className="flex flex-1 flex-col gap-5 p-5 pb-4">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-14" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
        <div className="space-y-2.5">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </CardContent>
      <CardFooter className="mt-auto flex justify-between gap-4 border-t bg-muted/40 px-5 pt-4 pb-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-24" />
      </CardFooter>
    </Card>
  );
}
