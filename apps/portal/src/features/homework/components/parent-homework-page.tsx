"use client";

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

import { ChildHomeworkView } from "./child-homework-view";

export function ParentHomeworkPage() {
  const today = toLocalDateKey(new Date());
  const { childrenQuery, children, child, setChildId } = useSelectedChild();

  return (
    <PageContainer>
      <div className="w-full space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Homework</h1>
            <p className="mt-2 text-muted-foreground">
              {child
                ? `${childName(child)} · ${childClassLabel(child)} — see what's due, hand it in, and track the teacher's checks.`
                : "See what's due, hand it in, and track the teacher's checks."}
            </p>
          </div>
          <ChildSwitcher options={children} value={child?.student_profile_id ?? null} onChange={setChildId} />
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
          <ChildHomeworkView
            key={child.student_profile_id}
            source={{ role: "parent", studentId: child.student_profile_id }}
            today={today}
            childFirstName={child.first_name}
          />
        )}
      </div>
    </PageContainer>
  );
}
