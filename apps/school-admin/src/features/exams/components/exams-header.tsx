"use client";

import {
  ClipboardCheck,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  totalExams: number;
  onCreateExam?: () => void;
};

export function ExamsHeader({
  totalExams,
  onCreateExam,
}: Props) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
          <ClipboardCheck className="size-5 text-muted-foreground" />
        </div>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Exams
          </h1>

          <p className="text-sm text-muted-foreground">
            Manage examinations, schedules, results, and performance.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-xs text-muted-foreground">
            Total Exams
          </p>

          <p className="text-lg font-semibold tabular-nums">
            {totalExams}
          </p>
        </div>

        <Button
          type="button"
          onClick={onCreateExam}
        >
          <Plus className="mr-2 size-4" />
          Create Exam
        </Button>
      </div>
    </div>
  );
}