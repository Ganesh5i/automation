import { InstantSearch } from "@/components/search/instant-search";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

export function HeroSearch() {
  return (
    <section className="hero-gradient py-16 md:py-24">
      <div className="container mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
          {SITE_NAME}
        </div>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-4xl mx-auto leading-tight">
          Find Jobs, Internships & Remote Opportunities Faster
        </h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
          {SITE_TAGLINE}. Search by company, role, search code, or location —
          get instant results.
        </p>
        <div className="mt-10 max-w-3xl mx-auto">
          <InstantSearch variant="hero" />
        </div>
      </div>
    </section>
  );
}
