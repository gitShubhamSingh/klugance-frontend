"use client";

import {
  MoreHorizontal,
  Pencil,
  UserRound,
  UserRoundCheck,
  UserRoundX,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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

import type {
  Teacher,
  TeacherStatus,
} from "../types";

type Props = {
  teachers: Teacher[];

  onView?: (teacher: Teacher) => void;

  onEdit?: (teacher: Teacher) => void;

  onDeactivate?: (
    teacher: Teacher,
  ) => void;
};

function getTeacherName(
  teacher: Teacher,
) {
  return `${teacher.first_name} ${teacher.last_name}`;
}

function getStatusLabel(
  status: TeacherStatus,
) {
  switch (status) {
    case "active":
      return "Active";

    case "inactive":
      return "Inactive";

    case "on_leave":
      return "On Leave";
  }
}

function getStatusClassName(
  status: TeacherStatus,
) {
  switch (status) {
    case "active":
      return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";

    case "inactive":
      return "bg-muted text-muted-foreground ring-border";

    case "on_leave":
      return "bg-amber-50 text-amber-700 ring-amber-600/20";
  }
}

export function TeachersTable({
  teachers,
  onView,
  onEdit,
  onDeactivate,
}: Props) {
  if (teachers.length === 0) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border bg-card p-8 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <UserRound className="size-6 text-muted-foreground" />
        </div>

        <h3 className="mt-4 font-semibold">
          No teachers found
        </h3>

        <p className="mt-1 max-w-md text-sm text-muted-foreground">
          Add your first teacher to start
          managing your school's teaching
          staff.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              Teacher
            </TableHead>

            <TableHead>
              Employee ID
            </TableHead>

            <TableHead>
              Department
            </TableHead>

            <TableHead>
              Classes
            </TableHead>

            <TableHead>
              Subjects
            </TableHead>

            <TableHead>
              Status
            </TableHead>

            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {teachers.map((teacher) => (
            <TableRow
              key={teacher.id}
              className="group"
            >
              <TableCell>
                <button
                  type="button"
                  className="flex items-center gap-3 text-left"
                  onClick={() =>
                    onView?.(teacher)
                  }
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted font-medium">
                    {teacher.first_name
                      .charAt(0)
                      .toUpperCase()}
                    {teacher.last_name
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <div className="truncate font-medium">
                      {getTeacherName(
                        teacher,
                      )}
                    </div>

                    <div className="truncate text-xs text-muted-foreground">
                      {teacher.email}
                    </div>
                  </div>
                </button>
              </TableCell>

              <TableCell className="font-mono text-sm">
                {teacher.employee_id}
              </TableCell>

              <TableCell>
                <div>
                  <div className="font-medium">
                    {
                      teacher.designation
                    }
                  </div>

                  {teacher.department && (
                    <div className="text-xs text-muted-foreground">
                      {
                        teacher.department
                      }
                    </div>
                  )}
                </div>
              </TableCell>

              <TableCell>
                {teacher.classes_count}
              </TableCell>

              <TableCell>
                {teacher.subjects_count}
              </TableCell>

              <TableCell>
                <span
                  className={[
                    "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
                    getStatusClassName(
                      teacher.status,
                    ),
                  ].join(" ")}
                >
                  {getStatusLabel(
                    teacher.status,
                  )}
                </span>
              </TableCell>

              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        aria-label={`Actions for ${getTeacherName(teacher)}`}
                      />
                    }
                  >
                    <MoreHorizontal className="size-4" />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        onView?.(teacher)
                      }
                    >
                      <UserRound className="size-4" />

                      View Profile
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() =>
                        onEdit?.(teacher)
                      }
                    >
                      <Pencil className="size-4" />

                      Edit Teacher
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {teacher.status ===
                    "active" ? (
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() =>
                          onDeactivate?.(
                            teacher,
                          )
                        }
                      >
                        <UserRoundX className="size-4" />

                        Deactivate
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onClick={() =>
                          onDeactivate?.(
                            teacher,
                          )
                        }
                      >
                        <UserRoundCheck className="size-4" />

                        Activate
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}