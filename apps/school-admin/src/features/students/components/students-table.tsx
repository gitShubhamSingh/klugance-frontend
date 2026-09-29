"use client";

import {
  MoreHorizontal,
  UserRound,
} from "lucide-react";

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

import type { Student } from "../types";

type Props = {
  students: Student[];

  isLoading?: boolean;

  onViewProfile?: (
    student: Student,
  ) => void;

  onEditStudent?: (
    student: Student,
  ) => void;
};

/*
 * ---------------------------------------------------------
 * Helpers
 * ---------------------------------------------------------
 */

function getStudentName(
  student: Student,
): string {
  const name = [
    student.first_name,
    student.middle_name,
    student.last_name,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return name || "Student";
}

function getStudentInitials(
  student: Student,
): string {
  const firstInitial =
    student.first_name?.charAt(0) ?? "";

  const lastInitial =
    student.last_name?.charAt(0) ?? "";

  const initials =
    `${firstInitial}${lastInitial}`.toUpperCase();

  return initials || "S";
}

function getStatusLabel(
  isActive: boolean,
): string {
  return isActive
    ? "Active"
    : "Inactive";
}

function getStatusClassName(
  isActive: boolean,
): string {
  return isActive
    ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
    : "bg-muted text-muted-foreground ring-border";
}

/*
 * ---------------------------------------------------------
 * Component
 * ---------------------------------------------------------
 */

export function StudentsTable({
  students,
  isLoading = false,
  onViewProfile,
  onEditStudent,
}: Props) {
  /*
   * -------------------------------------------------------
   * Loading
   * -------------------------------------------------------
   */

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                Student
              </TableHead>

              <TableHead>
                Admission Number
              </TableHead>

              <TableHead>
                Mobile Number
              </TableHead>

              <TableHead>
                Class
              </TableHead>

              <TableHead>
                Section
              </TableHead>

              <TableHead>
                Status
              </TableHead>

              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {Array.from({
              length: 5,
            }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="h-5 w-36 animate-pulse rounded bg-muted" />
                </TableCell>

                <TableCell>
                  <div className="h-5 w-24 animate-pulse rounded bg-muted" />
                </TableCell>

                <TableCell>
                  <div className="h-5 w-28 animate-pulse rounded bg-muted" />
                </TableCell>

                <TableCell>
                  <div className="h-5 w-16 animate-pulse rounded bg-muted" />
                </TableCell>

                <TableCell>
                  <div className="h-5 w-16 animate-pulse rounded bg-muted" />
                </TableCell>

                <TableCell>
                  <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
                </TableCell>

                <TableCell />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  /*
   * -------------------------------------------------------
   * Empty state
   * -------------------------------------------------------
   */

  if (students.length === 0) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border bg-card p-8 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <UserRound className="size-6 text-muted-foreground" />
        </div>

        <h3 className="mt-4 font-semibold">
          No students found
        </h3>

        <p className="mt-1 max-w-md text-sm text-muted-foreground">
          Students associated with your school will
          appear here.
        </p>
      </div>
    );
  }

  /*
   * -------------------------------------------------------
   * Table
   * -------------------------------------------------------
   */

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              Student
            </TableHead>

            <TableHead>
              Admission Number
            </TableHead>

            <TableHead>
              Mobile Number
            </TableHead>

            <TableHead>
              Class
            </TableHead>

            <TableHead>
              Section
            </TableHead>

            <TableHead>
              Status
            </TableHead>

            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {students.map((student) => {
            const name =
              getStudentName(student);

            const initials =
              getStudentInitials(student);

            const statusLabel =
              getStatusLabel(
                student.is_active,
              );

            const statusClassName =
              getStatusClassName(
                student.is_active,
              );

            return (
              <TableRow
                key={student.id}
                className="group"
              >
                {/* Student */}

                <TableCell>
                  <button
                    type="button"
                    className="flex items-center gap-3 text-left"
                    onClick={() =>
                      onViewProfile?.(
                        student,
                      )
                    }
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {initials}
                    </div>

                    <div className="min-w-0">
                      <div className="truncate font-medium">
                        {name}
                      </div>

                      <div className="truncate text-xs text-muted-foreground">
                        {student.email}
                      </div>
                    </div>
                  </button>
                </TableCell>

                {/* Admission Number */}

                <TableCell className="font-mono text-sm">
                  {student.admission_number ||
                    "—"}
                </TableCell>

                {/* Mobile */}

                <TableCell>
                  {student.mobile_number ||
                    "—"}
                </TableCell>

                {/* Class */}

                <TableCell>
                  {student.class_name ||
                    "—"}
                </TableCell>

                {/* Section */}

                <TableCell>
                  {student.section_name ||
                    "—"}
                </TableCell>

                {/* Status */}

                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusClassName}`}
                  >
                    {statusLabel}
                  </span>
                </TableCell>

                {/* Actions */}

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                      >
                        <MoreHorizontal className="size-4" />

                        <span className="sr-only">
                          Student actions
                        </span>
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          onViewProfile?.(
                            student,
                          )
                        }
                      >
                        View Profile
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() =>
                          onEditStudent?.(
                            student,
                          )
                        }
                      >
                        Edit Student
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