import { LucideIcon, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type StatCardProps = {
  title: string;
  value: string | number;
  trend?: string;
  description?: string;
  icon?: LucideIcon;
};

export function StatCard({
  title,
  value,
  trend,
  description,
  icon: Icon,
}: StatCardProps) {
  return (
    <Card className="rounded-2xl shadow-none transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              {title}
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              {value}
            </h2>
          </div>

          {Icon && (
            <div className="rounded-xl bg-muted p-3">
              <Icon className="size-5" />
            </div>
          )}
        </div>

        {(trend || description) && (
          <div className="mt-5 flex items-center justify-between">
            {trend && (
              <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                <TrendingUp className="size-4" />
                {trend}
              </div>
            )}

            {description && (
              <span className="text-xs text-muted-foreground">
                {description}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}