import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Star, TrendingUp, Building2 } from "lucide-react";

interface StatsCardsProps {
  stats: {
    totalJobs: number;
    featuredJobs: number;
    trendingJobs: number;
    totalCompanies: number;
    byCategory: { category: string; count: number }[];
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    { title: "Total Jobs", value: stats.totalJobs, icon: Briefcase },
    { title: "Featured", value: stats.featuredJobs, icon: Star },
    { title: "Trending", value: stats.trendingJobs, icon: TrendingUp },
    { title: "Companies", value: stats.totalCompanies, icon: Building2 },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Jobs by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {stats.byCategory.map((item) => (
              <div
                key={item.category}
                className="flex justify-between items-center p-3 rounded-lg bg-muted/50"
              >
                <span className="text-sm font-medium">
                  {item.category.replace(/_/g, " ")}
                </span>
                <span className="text-lg font-bold">{item.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
