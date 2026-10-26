"use client";

import { useState } from "react";

import { getErrorMessage } from "@/core/api/get-error-message";

import { useAttendanceOverview, useSectionAttendance } from "../hooks/use-attendance";
import { toDateKey } from "../lib/attendance-utils";
import { AttendanceHeader } from "./attendance-header";
import { AttendanceSectionDetail } from "./attendance-section-detail";
import { AttendanceSections } from "./attendance-sections";

/**
 * School-wide attendance for admins: what teachers have marked period by
 * period, for any day, per class and section. Read-only.
 */
export function AttendancePage() {
  const [date, setDate] = useState(() => toDateKey(new Date()));
  const [sectionId, setSectionId] = useState<string | null>(null);

  const overviewQuery = useAttendanceOverview(date);
  const sections = overviewQuery.data?.sections ?? [];

  // Keep the chosen section; otherwise the first one in class order.
  const activeId =
    sectionId && sections.some((s) => s.section_id === sectionId)
      ? sectionId
      : (sections[0]?.section_id ?? null);

  const sectionQuery = useSectionAttendance(activeId, date);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <AttendanceHeader
        date={date}
        today={toDateKey(new Date())}
        onDateChange={setDate}
        sections={sections}
        sectionId={activeId}
        onSectionChange={setSectionId}
        totals={overviewQuery.data?.totals ?? null}
        loading={overviewQuery.isLoading}
        refreshing={overviewQuery.isFetching || sectionQuery.isFetching}
        onRefresh={() => {
          void overviewQuery.refetch();
          void sectionQuery.refetch();
        }}
      />

      {overviewQuery.isError && !overviewQuery.data ? (
        <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center text-sm">
          {getErrorMessage(overviewQuery.error)}
        </div>
      ) : !overviewQuery.isLoading && sections.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <p className="font-medium">No classes or sections yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add classes and sections under Academics to see their attendance here.
          </p>
        </div>
      ) : (
        <>
          <AttendanceSectionDetail
            date={date}
            data={sectionQuery.data && sectionQuery.data.section_id === activeId ? sectionQuery.data : null}
            loading={Boolean(activeId) && (sectionQuery.isLoading || sectionQuery.data?.section_id !== activeId)}
            error={sectionQuery.isError ? getErrorMessage(sectionQuery.error) : null}
          />

          <AttendanceSections
            sections={sections}
            loading={overviewQuery.isLoading}
            selectedId={activeId}
            onSelect={setSectionId}
          />
        </>
      )}
    </div>
  );
}
