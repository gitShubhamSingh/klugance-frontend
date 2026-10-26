"use client";

import { PageContainer } from "@/components/layout/page-container";
import { toLocalDateKey } from "@/features/dashboard/hooks/use-teacher-dashboard";
import { ChildHomeworkView } from "@/features/homework";

export function StudentHomeworkPage() {
  const today = toLocalDateKey(new Date());

  return (
    <PageContainer>
      <div className="w-full space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Homework</h1>
          <p className="mt-2 text-muted-foreground">
            Everything your teachers have set. Hand in your work here and see when it&apos;s checked.
          </p>
        </div>
        <ChildHomeworkView source={{ role: "student" }} today={today} />
      </div>
    </PageContainer>
  );
}
