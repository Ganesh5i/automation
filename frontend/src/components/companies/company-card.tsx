import Link from "next/link";
import Image from "next/image";
import { Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { CompanyWithCount } from "@/types";

interface CompanyCardProps {
  company: CompanyWithCount;
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Link href={`/companies/${company.slug}`}>
      <Card className="glass-card h-full hover:-translate-y-1 transition-all duration-300">
        <CardContent className="p-6 flex flex-col items-center text-center gap-4">
          <div className="h-16 w-16 rounded-xl bg-muted flex items-center justify-center overflow-hidden">
            {company.logo ? (
              <Image
                src={company.logo}
                alt={company.name}
                width={64}
                height={64}
                className="object-contain p-2"
              />
            ) : (
              <Building2 className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{company.name}</h3>
            <p className="text-sm text-primary mt-1">
              {company._count.jobs} open{" "}
              {company._count.jobs === 1 ? "position" : "positions"}
            </p>
            {company.description && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {company.description}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
