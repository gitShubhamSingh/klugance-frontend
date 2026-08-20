"use client";

import {
  BookOpen,
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

import type { SchoolClass } from "../types";

type Props = {
  classes: SchoolClass[];
  onEdit: (
    schoolClass: SchoolClass,
  ) => void;
  onDelete: (
    schoolClass: SchoolClass,
  ) => void;
};

export function ClassesTable({
  classes,
  onEdit,
  onDelete,
}: Props) {
  if (classes.length === 0) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border bg-card p-8 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <BookOpen className="size-6 text-muted-foreground" />
        </div>

        <h3 className="mt-4 font-semibold">
          No classes
        </h3>

        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Create your first class to start
          configuring sections, subjects,
          students and academic operations.
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
              Class
            </TableHead>

            <TableHead>
              Code
            </TableHead>

            <TableHead>
              Description
            </TableHead>

            <TableHead>
              Order
            </TableHead>

            <TableHead className="w-16" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {classes.map(
            (schoolClass) => (
              <TableRow
                key={schoolClass.id}
              >
                <TableCell className="font-medium">
                  {schoolClass.name}
                </TableCell>

                <TableCell>
                  <Badge variant="secondary">
                    {schoolClass.code}
                  </Badge>
                </TableCell>

                <TableCell className="max-w-md text-muted-foreground">
                  {schoolClass.description ||
                    "—"}
                </TableCell>

                <TableCell>
                  {schoolClass.display_order}
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Class actions"
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      }
                    />

                    <DropdownMenuContent
                      align="end"
                      className="w-40"
                    >
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          onClick={() =>
                            onEdit(
                              schoolClass,
                            )
                          }
                        >
                          <Pencil className="size-4" />

                          Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() =>
                            onDelete(
                              schoolClass,
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
            ),
          )}
        </TableBody>
      </Table>
    </div>
  );
}