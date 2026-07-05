import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mx-auto mb-6">
        <FileQuestion className="h-8 w-8 text-muted-foreground" />
      </div>
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-xl text-muted-foreground mt-2">Page not found</p>
      <p className="text-sm text-muted-foreground mt-4 max-w-md mx-auto">
        The page you are looking for does not exist or may have been removed.
      </p>
      <Button nativeButton={false} render={<Link href="/" />} className="mt-8">
        Back to Home
      </Button>
    </div>
  );
}
