import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Building2 } from "lucide-react";

export async function PopularCompanies() {
  const companies = await db.company.findMany({
    include: { _count: { select: { jobs: true } } },
    orderBy: { jobs: { _count: "desc" } },
    take: 8,
  });

  if (companies.length === 0) return null;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Popular Companies</h2>
        <p className="text-muted-foreground mb-8">
          Top hiring companies with open positions
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {companies.map((company) => (
            <Link key={company.id} href={`/companies/${company.slug}`}>
              <Card className="glass-card hover:-translate-y-1 transition-all duration-300 h-full">
                <CardContent className="p-5 flex flex-col items-center text-center gap-3">
                  <div className="h-14 w-14 rounded-xl bg-muted flex items-center justify-center overflow-hidden">
                    {company.logo ? (
                      <Image
                        src={company.logo}
                        alt={company.name}
                        width={56}
                        height={56}
                        className="object-contain p-2"
                      />
                    ) : (
                      <Building2 className="h-7 w-7 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{company.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {company._count.jobs} open{" "}
                      {company._count.jobs === 1 ? "position" : "positions"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            href="/companies"
            className="text-sm text-primary hover:underline font-medium"
          >
            View all companies →
          </Link>
        </div>
      </div>
    </section>
  );
}
