import { createMetadata } from "@/lib/seo";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import { Search, Briefcase, Zap } from "lucide-react";

export const metadata = createMetadata({
  title: "About Us",
  description: `Learn about ${SITE_NAME} and how we help you find career opportunities.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-bold">About {SITE_NAME}</h1>
      <p className="text-xl text-muted-foreground mt-4">{SITE_TAGLINE}</p>

      <div className="mt-10 space-y-6 text-muted-foreground leading-relaxed">
        <p>
          {SITE_NAME} is your daily destination for job alerts, internships, fresher
          jobs, remote opportunities, off-campus drives, and work-from-home
          positions. We curate opportunities from top companies so you can find your
          next career move faster.
        </p>
        <p>
          Every job on our platform has a unique Search Code (e.g., CS001, CS002).
          Simply type the code in our search box to instantly find the exact
          opportunity you are looking for — no scrolling required.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        {[
          {
            icon: Search,
            title: "Instant Search",
            desc: "Search by company, role, location, or unique search code.",
          },
          {
            icon: Briefcase,
            title: "Daily Alerts",
            desc: "Fresh job postings across all categories every day.",
          },
          {
            icon: Zap,
            title: "Fast & Free",
            desc: "Browse and apply to opportunities at no cost.",
          },
        ].map((item) => (
          <div key={item.title} className="glass-card rounded-xl p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mx-auto mb-4">
              <item.icon className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-foreground">{item.title}</h3>
            <p className="text-sm text-muted-foreground mt-2">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
