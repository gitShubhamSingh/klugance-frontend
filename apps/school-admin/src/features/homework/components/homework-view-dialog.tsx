"use client";

import { CalendarDays, UserRound } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";

import type { Homework } from "../types";

type Props = {
  homework: Homework | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function HomeworkViewDialog({
  homework,
  open,
  onOpenChange,
}: Props) {
  if (!homework) {
    return null;
  }

  const percentage =
    homework.total_students === 0
      ? 0
      : Math.round(
          (homework.submitted_students /
            homework.total_students) *
            100,
        );

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {homework.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Badge variant="secondary">
              {homework.subject}
            </Badge>

            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              {homework.description}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Info
              label="Class"
              value={`${homework.class_name} · ${homework.section_name}`}
            />

            <Info
              label="Assigned By"
              value={homework.teacher_name}
              icon={<UserRound className="size-4" />}
            />

            <Info
              label="Assigned Date"
              value={formatDate(
                homework.assigned_date,
              )}
              icon={
                <CalendarDays className="size-4" />
              }
            />

            <Info
              label="Due Date"
              value={formatDate(homework.due_date)}
              icon={
                <CalendarDays className="size-4" />
              }
            />
          </div>

          <div className="rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">
                  Submission Progress
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {homework.submitted_students} of{" "}
                  {homework.total_students} students
                  submitted
                </p>
              </div>

              <p className="text-lg font-semibold tabular-nums">
                {percentage}%
              </p>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-foreground"
                style={{
                  width: `${percentage}%`,
                }}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Info({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border p-3">
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <div className="mt-1 flex items-center gap-2 text-sm font-medium">
        {icon}
        {value}
      </div>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}