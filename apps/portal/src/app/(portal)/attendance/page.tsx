import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/common/page-header";

export default function AttendancePage() {
  return (
    <PageContainer>
      <PageHeader
        title="Attendance"
        description="Manage attendance for your assigned students."
      />
    </PageContainer>
  );
}
