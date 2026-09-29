import {
  CalendarCheck,
  ClipboardCheck,
  FileText,
  Users,
} from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";

export default function DashboardPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Good morning, Teacher"
        description="Here’s what is happening with your classes today."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="My Students"
          value="0"
          icon={Users}
        />

        <StatCard
          title="Attendance"
          value="0"
          icon={CalendarCheck}
        />

        <StatCard
          title="Homework"
          value="0"
          icon={ClipboardCheck}
        />

        <StatCard
          title="Exams"
          value="0"
          icon={FileText}
        />
      </div>
    </PageContainer>
  );
}
