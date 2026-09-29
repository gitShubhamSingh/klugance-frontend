"use client";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  MoreHorizontal,
  Pencil,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { Homework, HomeworkStatus } from "../types";

type Props = {
  homework: Homework[];

  onView: (homework: Homework) => void;

  onEdit: (homework: Homework) => void;
};

export function HomeworkTable({
  homework,
  onView,
  onEdit,
}: Props) {
  if (homework.length === 0) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border bg-card p-8 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <CalendarDays className="size-6 text-muted-foreground" />
        </div>

        <h3 className="mt-4 font-semibold">
          No homework found
        </h3>

        <p className="mt-1 max-w-md text-sm text-muted-foreground">
          Try changing your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-4">
              Homework
            </TableHead>

            <TableHead className="px-4">
              Class
            </TableHead>

            <TableHead className="px-4">
              Teacher
            </TableHead>

            <TableHead className="px-4">
              Due Date
            </TableHead>

            <TableHead className="px-4">
              Submissions
            </TableHead>

            <TableHead className="px-4">
              Status
            </TableHead>

            <TableHead className="w-12 px-4" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {homework.map((item) => {
            const percentage =
              item.total_students === 0
                ? 0
                : Math.round(
                    (item.submitted_students /
                      item.total_students) *
                      100,
                  );

            return (
              <TableRow key={item.id}>
                {/* Homework */}
                <TableCell className="px-4 py-4">
                  <div className="min-w-0">
                    <p className="font-medium">
                      {item.title}
                    </p>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {item.subject}
                    </p>
                  </div>
                </TableCell>

                {/* Class */}
                <TableCell className="px-4 py-4">
                  <div>
                    <p className="text-sm font-medium">
                      {item.class_name}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {item.section_name}
                    </p>
                  </div>
                </TableCell>

                {/* Teacher */}
                <TableCell className="px-4 py-4">
                  {item.teacher_name}
                </TableCell>

                {/* Due Date */}
                <TableCell className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Clock3 className="size-4 text-muted-foreground" />

                    <span>
                      {formatDate(item.due_date)}
                    </span>
                  </div>
                </TableCell>

                {/* Submissions */}
                <TableCell className="px-4 py-4">
                  <div className="min-w-28">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {item.submitted_students}/
                        {item.total_students}
                      </span>

                      <span className="font-medium">
                        {percentage}%
                      </span>
                    </div>

                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-foreground transition-all"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell className="px-4 py-4">
                  <HomeworkStatusBadge
                    status={item.status}
                  />
                </TableCell>

                {/* Actions */}
                <TableCell className="px-4 py-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8"
                      >
                        <MoreHorizontal className="size-4" />

                        <span className="sr-only">
                          Homework actions
                        </span>
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onView(item)}
                      >
                        <Eye className="mr-2 size-4" />
                        View Homework
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => onEdit(item)}
                      >
                        <Pencil className="mr-2 size-4" />
                        Edit Homework
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function HomeworkStatusBadge({
  status,
}: {
  status: HomeworkStatus;
}) {
  const config = {
    active: {
      label: "Active",
      icon: CheckCircle2,
    },

    due_soon: {
      label: "Due Soon",
      icon: Clock3,
    },

    overdue: {
      label: "Overdue",
      icon: Clock3,
    },

    completed: {
      label: "Completed",
      icon: CheckCircle2,
    },
  }[status];

  const Icon = config.icon;

  return (
    <Badge
      variant={
        status === "overdue"
          ? "destructive"
          : status === "completed"
            ? "secondary"
            : "default"
      }
      className="gap-1 rounded-full"
    >
      <Icon className="size-3" />

      {config.label}
    </Badge>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}