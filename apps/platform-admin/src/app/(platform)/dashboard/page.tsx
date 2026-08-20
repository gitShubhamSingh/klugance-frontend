import { StatCard } from "@/components/common/stat-card";
import {
  School,
  Users,
  Server,
  TriangleAlert,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      <div>
        <h2 className="text-3xl font-bold">
          Dashboard
        </h2>

        <p className="mt-2 text-muted-foreground">
          Monitor your entire SaaS platform from one place.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Active Schools"
          value="124"
          trend="+12%"
          description="Compared to last month"
        />

        <StatCard
          title="Active Users"
          value="8,421"
          trend="+8%"
          description="Teachers, parents and admins"
        />

        <StatCard
          title="API Requests"
          value="2.3M"
          trend="+16%"
          description="Processed today"
        />

        <StatCard
          title="Critical Alerts"
          value="3"
          trend="-2"
          description="Require your attention"
        />
      </div>

    {/* <div className="grid gap-6 lg:grid-cols-2">
        <GrowthChart />
        <ApiChart />
    </div>

    <div className="grid gap-6 lg:grid-cols-2">
        <RecentSchools />
        <RecentActivity />
    </div>

    <div className="grid gap-6 lg:grid-cols-2">
        <SystemHealth />
        <BackgroundJobs />
    </div>

    <SubscriptionsTable /> */}
    </div>
  );
}