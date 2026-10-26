"use client";

import { useState } from "react";
import { Award, CalendarClock, ChevronDown, FileText } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer } from "@/components/layout/page-container";
import { getErrorMessage } from "@/core/api/get-error-message";
import { toLocalDateKey } from "@/features/dashboard/hooks/use-teacher-dashboard";
import { SectionCard } from "@/features/dashboard/components/shared/section-card";
import { LoadErrorState } from "@/features/parent-children";
import { cn } from "@/lib/utils";

import { useStudentExams } from "../hooks/use-student";
import { formatDay, formatPercent } from "../lib/student-utils";
import type { ExamResult } from "../types/student";

export function StudentExamsPage() {
  const today = toLocalDateKey(new Date());
  const query = useStudentExams(today);
  const data = query.data;

  return (
    <PageContainer>
      <div className="w-full space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Exams & Results</h1>
          <p className="mt-2 text-muted-foreground">Upcoming papers and the results your school has published.</p>
        </div>

        {query.isLoading ? (
          <div className="space-y-4" role="status" aria-label="Loading exams">
            <Skeleton className="h-40 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
          </div>
        ) : query.isError || !data ? (
          <LoadErrorState
            title="Unable to load your exams"
            message={getErrorMessage(query.error)}
            onRetry={() => void query.refetch()}
          />
        ) : (
          <>
            <SectionCard title="Upcoming exams" description="Plan your revision" icon={CalendarClock}>
              {data.upcoming.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">No exams scheduled right now.</p>
              ) : (
                <ul className="grid gap-3 sm:grid-cols-2">
                  {data.upcoming.map((exam) => (
                    <li key={exam.exam_subject_id} className="flex items-center gap-4 rounded-2xl border p-3">
                      <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-xl bg-muted">
                        <span className="text-xl leading-none font-bold tabular-nums">{exam.days_left}</span>
                        <span className="mt-0.5 text-3xs font-medium uppercase">{exam.days_left === 1 ? "day" : "days"}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{exam.subject_name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {exam.exam_name} · {formatDay(exam.exam_date)}
                        </p>
                        <p className="mt-1 text-xs text-foreground/70">
                          Max {exam.max_marks} · Pass {exam.pass_marks}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </SectionCard>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold tracking-tight">Results</h2>
              {data.results.length === 0 ? (
                <div className="rounded-2xl border border-dashed p-10 text-center">
                  <FileText className="mx-auto size-7 text-muted-foreground" />
                  <p className="mt-3 text-sm text-muted-foreground">No results have been published yet.</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {data.results.map((result, i) => (
                    <ResultCard key={result.exam_id} result={result} defaultOpen={i === 0} />
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </div>
    </PageContainer>
  );
}

function ResultCard({ result, defaultOpen }: { result: ExamResult; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const rc = result.report_card;

  return (
    <li className="overflow-hidden rounded-2xl border bg-card">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-muted/40 sm:p-5"
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted">
          <Award className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{result.exam_name}</p>
          <p className="text-xs text-muted-foreground">
            {result.start_date && formatDay(result.start_date, true)}
            {result.end_date && result.end_date !== result.start_date && ` – ${formatDay(result.end_date, true)}`}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xl font-semibold tabular-nums">{formatPercent(rc?.percentage ?? result.percentage)}</p>
          <p className="text-xs text-muted-foreground">
            {rc ? `Grade ${rc.grade} · ${rc.result_status}` : `${result.total_obtained} / ${result.total_max}`}
          </p>
        </div>
        <ChevronDown className={cn("size-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="overflow-x-auto border-t">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground">
                <th className="bg-muted/30 px-4 py-2.5 font-semibold sm:px-5">Subject</th>
                <th className="bg-muted/30 px-3 py-2.5 text-right font-semibold">Marks</th>
                <th className="hidden bg-muted/30 px-3 py-2.5 text-right font-semibold sm:table-cell">Section avg.</th>
                <th className="bg-muted/30 px-4 py-2.5 text-right font-semibold sm:px-5">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {result.subjects.map((s, i) => (
                <tr key={`${s.subject_name}-${i}`}>
                  <td className="px-4 py-3 sm:px-5">
                    <p className="font-medium">{s.subject_name}</p>
                    {s.remarks && <p className="text-xs text-muted-foreground">{s.remarks}</p>}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums">
                    {s.marks_obtained === null ? "—" : s.marks_obtained}
                    <span className="text-xs text-muted-foreground">/{s.max_marks}</span>
                  </td>
                  <td className="hidden px-3 py-3 text-right text-muted-foreground tabular-nums sm:table-cell">
                    {formatPercent(s.section_average_percent)}
                  </td>
                  <td className="px-4 py-3 text-right sm:px-5">
                    {s.passed === null ? (
                      <span className="text-xs text-muted-foreground">Not graded</span>
                    ) : (
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-2xs font-medium",
                          s.passed
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                            : "bg-rose-500/10 text-rose-700 dark:text-rose-300",
                        )}
                      >
                        {s.passed ? "Pass" : "Below pass mark"}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </li>
  );
}
