import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

type DashboardCardProps = {
  title: string;
  children: ReactNode;
};

export function DashboardCard({
  title,
  children,
}: DashboardCardProps) {
  return (
    <Card className="rounded-2xl shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}