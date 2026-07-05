"use client";

import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBookmarks } from "@/lib/hooks/use-bookmarks";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  searchCode: string;
}

export function BookmarkButton({ searchCode }: BookmarkButtonProps) {
  const { toggle, isBookmarked, loaded } = useBookmarks();
  const saved = loaded && isBookmarked(searchCode);

  const handleClick = () => {
    const nowSaved = toggle(searchCode);
    toast.success(nowSaved ? "Job saved!" : "Job removed from saved");
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      className={cn("gap-2", saved && "text-primary border-primary")}
    >
      <Bookmark className={cn("h-4 w-4", saved && "fill-current")} />
      {saved ? "Saved" : "Save Job"}
    </Button>
  );
}
