"use client";

import {
  CalendarRange,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
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

import type { AcademicYear } from "../types";

type Props = {
  academicYears?: AcademicYear[];
  isLoading?: boolean;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export function AcademicYearsTable({
  academicYears = [],
  isLoading = false,
}: Props) {
  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Academic Year</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="h-5 w-32 animate-pulse rounded bg-muted" />
                </TableCell>

                <TableCell>
                  <div className="h-5 w-24 animate-pulse rounded bg-muted" />
                </TableCell>

                <TableCell>
                  <div className="h-5 w-24 animate-pulse rounded bg-muted" />
                </TableCell>

                <TableCell>
                  <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
                </TableCell>

                <TableCell>
                  <div className="ml-auto size-8 animate-pulse rounded bg-muted" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (academicYears.length === 0) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border bg-card p-8 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <CalendarRange className="size-6 text-muted-foreground" />
        </div>

        <h3 className="mt-4 font-semibold">
          No academic years
        </h3>

        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Create your first academic year to start configuring
          classes, sections, subjects and other academic operations.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Academic Year</TableHead>

            <TableHead>Start Date</TableHead>

            <TableHead>End Date</TableHead>

            <TableHead>Status</TableHead>

            <TableHead className="w-16" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {academicYears.map((academicYear) => (
            <TableRow key={academicYear.id}>
              {/* Academic Year */}
              <TableCell className="font-medium">
                {academicYear.name}
              </TableCell>

              {/* Start Date */}
              <TableCell>
                {formatDate(academicYear.start_date)}
              </TableCell>

              {/* End Date */}
              <TableCell>
                {formatDate(academicYear.end_date)}
              </TableCell>

              {/* Status */}
              <TableCell>
                {academicYear.is_current ? (
                  <Badge className="rounded-full">
                    Current
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="rounded-full"
                  >
                    Inactive
                  </Badge>
                )}
              </TableCell>

              {/* Actions */}
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      aria-label="Academic year actions"
                    >
                      <MoreHorizontal className="size-4" />

                      <span className="sr-only">
                        Academic year actions
                      </span>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="w-44"
                  >
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <Pencil className="size-4" />
                        Edit
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        variant="destructive"
                        disabled={academicYear.is_current}
                      >
                        <Trash2 className="size-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
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