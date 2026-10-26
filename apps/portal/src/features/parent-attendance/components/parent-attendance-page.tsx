"use client";

import { useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer } from "@/components/layout/page-container";
import { getErrorMessage } from "@/core/api/get-error-message";
import { toLocalDateKey } from "@/features/dashboard/hooks/use-teacher-dashboard";
import {
  ChildSwitcher,
  LoadErrorState,
  NoChildrenState,
  childClassLabel,
  childName,
  useSelectedChild,
} from "@/features/parent-children";
import { AttendanceView, MonthPicker } from "@/features/student/components/attendance-view";

import { useParentAttendance } from "../hooks/use-parent-attendance";

export function ParentAttendancePage() {
  const today = toLocalDateKey(new Date());
  const currentMonth = today.slice(0, 7);
  const [month, setMonth] = useState(currentMonth);

  const { childrenQuery, children, child, setChildId } = useSelectedChild();
  const query = useParentAttendance(child?.student_profile_id ?? null, today, month);

  return (
    <PageContainer>
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
            <p className="mt-2 text-muted-foreground">
              {child
                ? `${childName(child)} · ${childClassLabel(child)} — taken every period`
                : "Taken every period — see each day and each period."}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <ChildSwitcher options={children} value={child?.student_profile_id ?? null} onChange={setChildId} />
            <MonthPicker month={month} currentMonth={currentMonth} onChange={setMonth} />
          </div>
        </div>

        {childrenQuery.isLoading ? (
          <Skeleton className="h-96 rounded-2xl" role="status" aria-label="Loading" />
        ) : childrenQuery.isError ? (
          <LoadErrorState
            title="Unable to load your children"
            message={getErrorMessage(childrenQuery.error)}
            onRetry={() => void childrenQuery.refetch()}
          />
        ) : !child ? (
          <NoChildrenState />
        ) : (
          <AttendanceView key={child.student_profile_id} query={query} today={today} subject={child.first_name} />
        )}
      </div>
    </PageContainer>
  );
}
