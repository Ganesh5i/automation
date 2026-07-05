import Link from "next/link";
import { Briefcase } from "lucide-react";
import { NAV_LINKS, SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t glass-card-enhanced mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-purple-600 text-primary-foreground shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                <Briefcase className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">{SITE_NAME}</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-md">
              {SITE_TAGLINE}. Daily job alerts, internships, fresher jobs,
              remote jobs, off-campus drives, and work-from-home opportunities.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Quick Links</h3>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Job Categories</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/jobs" className="hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                  Fresher Jobs
                </Link>
              </li>
              <li>
                <Link href="/internships" className="hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                  Internships
                </Link>
              </li>
              <li>
                <Link href="/remote-jobs" className="hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                  Remote Jobs
                </Link>
              </li>
              <li>
                <Link href="/work-from-home" className="hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                  Work From Home
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
