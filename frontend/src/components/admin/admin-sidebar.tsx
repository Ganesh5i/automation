"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Building2,
  Tags,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SITE_NAME } from "@/lib/constants";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/jobs", label: "Jobs", icon: Briefcase },
  { href: "/admin/companies", label: "Companies", icon: Building2 },
  { href: "/admin/categories", label: "Categories", icon: Tags },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-muted/30 min-h-screen p-4 flex flex-col">
      <div className="mb-8">
        <Link href="/admin" className="font-bold text-lg">
          {SITE_NAME}
        </Link>
        <p className="text-xs text-muted-foreground">Admin Panel</p>
      </div>
      <nav className="flex-1 space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              pathname === link.href
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            )}
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        ))}
      </nav>
      <Button
        variant="ghost"
        className="justify-start gap-2 mt-4"
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </Button>
    </aside>
  );
}
