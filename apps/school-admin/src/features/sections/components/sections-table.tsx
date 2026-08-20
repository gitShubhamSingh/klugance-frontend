"use client";

import {
  Layers3,
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

import type { SchoolClass } from "@/features/classes";
import type { SchoolSection } from "../types";

type Props = {
  sections: SchoolSection[];
  classes: SchoolClass[];

  onEdit: (
    section: SchoolSection,
  ) => void;

  onDelete: (
    section: SchoolSection,
  ) => void;
};

export function SectionsTable({
  sections,
  classes,
  onEdit,
  onDelete,
}: Props) {
  if (sections.length === 0) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border bg-card p-8 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <Layers3 className="size-6 text-muted-foreground" />
        </div>

        <h3 className="mt-4 font-semibold">
          No sections
        </h3>

        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Create sections for your classes
          to organize students and academic
          operations.
        </p>
      </div>
    );
  }

  const classNames = new Map(
    classes.map((schoolClass) => [
      schoolClass.id,
      schoolClass.name,
    ]),
  );

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              Section
            </TableHead>

            <TableHead>
              Code
            </TableHead>

            <TableHead>
              Class
            </TableHead>

            <TableHead className="w-16" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {sections.map((section) => (
            <TableRow key={section.id}>
              <TableCell className="font-medium">
                {section.name}
              </TableCell>

              <TableCell>
                <Badge variant="secondary">
                  {section.code}
                </Badge>
              </TableCell>

              <TableCell>
                {classNames.get(
                  section.class_id,
                ) ?? "Unknown Class"}
              </TableCell>

              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Section actions"
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
                          onEdit(section)
                        }
                      >
                        <Pencil className="size-4" />

                        Edit
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() =>
                          onDelete(section)
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
}