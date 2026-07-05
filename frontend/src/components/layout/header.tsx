"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, Search } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { InstantSearch } from "@/components/search/instant-search";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="w-full border-b glass-card-enhanced">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            {SITE_NAME}
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 hover:bg-primary/10 hover:text-primary hover:shadow-md",
                pathname === link.href
                  ? "text-primary bg-primary/10 shadow-md"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Search jobs" />
              }
            >
              <Search className="h-4 w-4" />
            </SheetTrigger>
            <SheetContent side="top" className="h-auto max-h-[85vh]">
              <SheetHeader>
                <SheetTitle>Search Jobs</SheetTitle>
              </SheetHeader>
              <div className="px-4 pb-6">
                <InstantSearch variant="compact" />
              </div>
            </SheetContent>
          </Sheet>
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
