"use client";

import {
  MoreHorizontal,
  Pencil,
  UserRound,
  UserRoundCheck,
  UserRoundX,
  UserRoundPlus,
  ClipboardList

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

import type { Teacher } from "../types";

type Props = {
  teachers: Teacher[];

  onView?: (teacher: Teacher) => void;

  onEdit?: (teacher: Teacher) => void;

  onAssign?: (teacher: Teacher) => void;

  onDeactivate?: (teacher: Teacher) => void;

};

function getTeacherName(teacher: Teacher): string {
  const name = [
    teacher.first_name,
    teacher.middle_name,
    teacher.last_name,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return name || "Teacher";
}

function getTeacherInitials(teacher: Teacher): string {
  const firstInitial =
    teacher.first_name?.charAt(0) ?? "";

  const lastInitial =
    teacher.last_name?.charAt(0) ?? "";

  const initials =
    `${firstInitial}${lastInitial}`.toUpperCase();

  return initials || "T";
}

function getStatusLabel(
  isActive: boolean,
): string {
  return isActive ? "Active" : "Inactive";
}

function getStatusClassName(
  isActive: boolean,
): string {
  return isActive
    ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
    : "bg-muted text-muted-foreground ring-border";
}

function formatJoiningDate(
  joiningDate: string | null,
): string {
  if (!joiningDate) {
    return "Not provided";
  }

  const date = new Date(
    `${joiningDate}T00:00:00`,
  );

  if (Number.isNaN(date.getTime())) {
    return "Not provided";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  ).format(date);
}


export function TeachersTable({
  teachers,
  onView,
  onEdit,
  onAssign,
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
              Qualification
            </TableHead>

            <TableHead>
              Experience
            </TableHead>

            <TableHead>
              Joining Date
            </TableHead>

            <TableHead>
              Status
            </TableHead>

            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {teachers.map((teacher) => {
            const teacherName =
              getTeacherName(teacher);

            const initials =
              getTeacherInitials(teacher);

            const statusLabel =
              getStatusLabel(
                teacher.is_active,
              );

            const statusClassName =
              getStatusClassName(
                teacher.is_active,
              );

            return (
              <TableRow
                key={teacher.id}
                className="group"
              >
                {/* =======================================
                    TEACHER
                    ======================================= */}

                <TableCell>
                  <button
                    type="button"
                    className="flex items-center gap-3 text-left"
                    onClick={() =>
                      onView?.(teacher)
                    }
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {initials}
                    </div>

                    <div className="min-w-0">
                      <div className="truncate font-medium">
                        {teacherName}
                      </div>

                      <div className="truncate text-xs text-muted-foreground">
                        {teacher.email ||
                          teacher.employee_code}
                      </div>
                    </div>
                  </button>
                </TableCell>

                {/* =======================================
                    EMPLOYEE CODE
                    ======================================= */}

                <TableCell className="font-mono text-sm">
                  {teacher.employee_code}
                </TableCell>

                {/* =======================================
                    QUALIFICATION
                    ======================================= */}

                <TableCell>
                  {teacher.qualification ? (
                    <span className="text-sm">
                      {teacher.qualification}
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Not provided
                    </span>
                  )}
                </TableCell>

                {/* =======================================
                    EXPERIENCE
                    ======================================= */}

                <TableCell>
                  <span className="text-sm">
                    {teacher.experience_years ?? 0}{" "}
                    {teacher.experience_years === 1
                      ? "year"
                      : "years"}
                  </span>
                </TableCell>

                {/* =======================================
                    JOINING DATE
                    ======================================= */}

                <TableCell>
                  <span className="text-sm">
                    {formatJoiningDate(
                      teacher.joining_date,
                    )}
                  </span>
                </TableCell>

                {/* =======================================
                    STATUS
                    ======================================= */}

                <TableCell>
                  <span
                    className={[
                      "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
                      statusClassName,
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "mr-1.5 size-1.5 rounded-full",
                        teacher.is_active
                          ? "bg-emerald-600"
                          : "bg-muted-foreground",
                      ].join(" ")}
                    />

                    {statusLabel}
                  </span>
                </TableCell>

                {/* =======================================
                    ACTIONS
                    ======================================= */}

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          type="button"
                          aria-label={`Actions for ${teacherName}`}
                        />
                      }
                    >
                      <MoreHorizontal className="size-4" />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      {/* View */}

                      <DropdownMenuItem
                        onClick={() =>
                          onView?.(teacher)
                        }
                      >
                        <UserRound className="size-4" />

                        View 
                      </DropdownMenuItem>

                      {/* Edit */}

                      <DropdownMenuItem
                        onClick={() =>
                          onEdit?.(teacher)
                        }
                      >
                        <Pencil className="size-4" />

                        Edit
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem
                        onClick={() =>
                          onAssign?.(teacher)
                        }
                      >
                        <ClipboardList className="size-4" />

                        Assignments
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuSeparator />

                      {/* Activate / Deactivate */}

                      {teacher.is_active ? (
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
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}