"use client";

import {
  CalendarCheck,
  CalendarRange,
  Loader2,
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
  academicYears: AcademicYear[];
  onEdit: (academicYear: AcademicYear) => void;
  onDelete: (academicYear: AcademicYear) => void;

  onSetCurrent: (
    academicYear: AcademicYear,
  ) => void;

  settingCurrentId?: string;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "2-digit",
      timeZone: "UTC",
    },
  ).format(
    new Date(`${value}T00:00:00Z`),
  );
}

export function AcademicYearsTable({
  academicYears,
  onEdit,
  onDelete,
  onSetCurrent,
  settingCurrentId,
}: Props) {
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
          Create your first academic year to
          start configuring classes, sections,
          subjects and other academic
          operations.
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
              Academic Year
            </TableHead>

            <TableHead>
              Start Date
            </TableHead>

            <TableHead>
              End Date
            </TableHead>

            <TableHead>
              Status
            </TableHead>

            <TableHead className="w-16" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {academicYears.map(
            (academicYear) => {
              const isSettingCurrent =
                settingCurrentId ===
                academicYear.id;

              return (
                <TableRow
                  key={academicYear.id}
                >
                  <TableCell className="font-medium">
                    {academicYear.name}
                  </TableCell>

                  <TableCell>
                    {formatDate(
                      academicYear.start_date,
                    )}
                  </TableCell>

                  <TableCell>
                    {formatDate(
                      academicYear.end_date,
                    )}
                  </TableCell>

                  <TableCell>
                    {academicYear.is_current ? (
                      <Badge>
                        Current
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        Inactive
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Academic year actions"
                          >
                            <MoreHorizontal className="size-4" />
                          </Button>
                        }
                      />

                      <DropdownMenuContent
                        align="end"
                        className="w-48"
                      >
                        <DropdownMenuGroup>
                          {!academicYear.is_current && (
                            <DropdownMenuItem
                              disabled={
                                isSettingCurrent
                              }
                              onClick={() =>
                                onSetCurrent(
                                  academicYear,
                                )
                              }
                            >
                              {isSettingCurrent ? (
                                <Loader2 className="size-4 animate-spin" />
                              ) : (
                                <CalendarCheck className="size-4" />
                              )}

                              Set as Current
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuItem
                            onClick={() =>
                              onEdit(
                                academicYear,
                              )
                            }
                          >
                            <Pencil className="size-4" />

                            Edit
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            variant="destructive"
                            disabled={
                              academicYear.is_current
                            }
                            onClick={() =>
                              onDelete(
                                academicYear,
                              )
                            }
                          >
                            <Trash2 className="size-4" />

                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            },
          )}
        </TableBody>
      </Table>
    </div>
  );
}