"use client";

import {
  CalendarDays,
  MoreHorizontal,
  School,
  Users,
  BookOpen,
  ClipboardCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Exam } from "../types";
import { ExamStatusBadge } from "./exam-status-badge";

type Props = {
  exam: Exam;
  onView?: (exam: Exam) => void;
  onEdit?: (exam: Exam) => void;
};

function formatDate(
  value: string,
) {
  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  ).format(new Date(value));
}

function getProgress(exam: Exam) {
  if (exam.student_count === 0) {
    return 0;
  }

  return Math.round(
    (exam.marks_reviewed /
      exam.student_count) *
      100,
  );
}

export function ExamCard({
  exam,
  onView,
  onEdit,
}: Props) {
  const progress = getProgress(exam);

  return (
    <div className="rounded-xl border bg-card transition-colors hover:bg-muted/20">
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-base font-semibold">
                {exam.name}
              </h3>

              <ExamStatusBadge
                status={exam.status}
              />
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Academic Year {exam.academic_year}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 shrink-0"
              >
                <MoreHorizontal className="size-4" />

                <span className="sr-only">
                  Exam actions
                </span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onView?.(exam)}
              >
                View Examination
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onEdit?.(exam)}
              >
                Edit Examination
              </DropdownMenuItem>

              <DropdownMenuItem>
                View Schedule
              </DropdownMenuItem>

              <DropdownMenuItem>
                Review Results
              </DropdownMenuItem>

              {exam.status === "results_ready" && (
                <DropdownMenuItem>
                  Publish Results
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />

              {exam.status !== "cancelled" &&
                exam.status !== "published" && (
                  <DropdownMenuItem className="text-destructive focus:text-destructive">
                    Cancel Examination
                  </DropdownMenuItem>
                )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-4">
          <InfoItem
            icon={
              <CalendarDays className="size-4" />
            }
            label="Exam Period"
            value={`${formatDate(exam.start_date)} — ${formatDate(exam.end_date)}`}
          />

          <InfoItem
            icon={
              <BookOpen className="size-4" />
            }
            label="Subjects"
            value={`${exam.subject_count}`}
          />

          <InfoItem
            icon={
              <School className="size-4" />
            }
            label="Classes"
            value={`${exam.class_count}`}
          />

          <InfoItem
            icon={
              <Users className="size-4" />
            }
            label="Students"
            value={`${exam.student_count}`}
          />
        </div>

        <div className="mt-5 border-t pt-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="size-4 text-muted-foreground" />

              <span className="text-sm font-medium">
                Results Review
              </span>
            </div>

            <span className="text-sm font-medium tabular-nums">
              {exam.marks_reviewed}/
              {exam.student_count}
            </span>
          </div>

          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-foreground transition-all"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {progress}% reviewed
            </p>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 px-2"
              onClick={() => onView?.(exam)}
            >
              View details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-2.5">
      <div className="mt-0.5 text-muted-foreground">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">
          {label}
        </p>

        <p className="mt-0.5 truncate text-sm font-medium">
          {value}
        </p>
      </div>
    </div>
  );
}