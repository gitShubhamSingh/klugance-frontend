
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";

export default function TeacherDashboardPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Teacher Dashboard"
        description="Your teaching schedule, classes, and daily activities."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="My Classes" value="—" />
        <StatCard title="Total Students" value="—" />
        <StatCard title="Attendance Pending" value="—" />
        <StatCard title="Homework to Review" value="—" />
      </div>
    </PageContainer>
  );
}
