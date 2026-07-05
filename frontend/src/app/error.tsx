"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mx-auto mb-6">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="text-muted-foreground mt-2 max-w-md mx-auto">
        We encountered an error loading this page. Please try again.
      </p>
      <Button onClick={reset} className="mt-6">
        Try Again
      </Button>
    </div>
  );
}
