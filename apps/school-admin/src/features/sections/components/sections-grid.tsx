"use client";

import {
  Layers3,
  MoreHorizontal,
  Pencil,
  School,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { SchoolClass } from "@/features/classes/types";

import type { SchoolSection } from "../types";

type Props = {
  sections: SchoolSection[];
  classes: SchoolClass[];
  onEdit: (section: SchoolSection) => void;
  onDelete: (section: SchoolSection) => void;
};

export function SectionsGrid({
  sections,
  classes,
  onEdit,
  onDelete,
}: Props) {
  if (sections.length === 0) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border bg-card p-8 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
          <Layers3 className="size-7 text-muted-foreground" />
        </div>

        <h2 className="mt-5 text-lg font-semibold">
          No Sections Available
        </h2>

        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          No sections have been created for this class yet.
          Create your first section to organize students
          more effectively.
        </p>
      </div>
    );
  }

  return (
    <div className="group/classes grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {sections.map((section) => {
      const schoolClass = classes.find(
        (item) => item.id === section.class_id,
      );
  
      return (
        <section
          key={section.id}
          className="
            group relative overflow-hidden rounded-2xl border bg-card
            transition-all duration-300 ease-out

            group-hover/classes:opacity-60
            group-hover/classes:scale-[0.98]

            hover:!opacity-100
            hover:!scale-100
            hover:-translate-y-1
            hover:border-primary/40
            hover:shadow-xl
            hover:shadow-primary/10
          "
        >
          {/* =========================================== */}
          {/* TOP RIGHT HOVER IMPACT */}
          {/* =========================================== */}
  
          <div
            className="
              absolute right-0 top-0 size-28 rounded-bl-full
              bg-muted/40
              transition-all duration-500 ease-out
              group-hover:scale-125
              group-hover:bg-primary/10
            "
          />
  
          {/* =========================================== */}
          {/* SUBTLE HOVER GLOW */}
          {/* =========================================== */}
  
          <div
            className="
              pointer-events-none absolute inset-0 opacity-0
              bg-gradient-to-br
              from-primary/[0.03]
              via-transparent
              to-transparent
              transition-opacity duration-300
              group-hover:opacity-100
            "
          />
  
          <div className="relative p-5">
            {/* =========================================== */}
            {/* CARD HEADER */}
            {/* =========================================== */}
  
            <div className="flex items-start justify-between gap-4">
              <div
                className="
                  flex size-12 items-center justify-center
                  rounded-2xl border bg-muted/50
                  transition-all duration-300
                  group-hover:scale-110
                  group-hover:border-primary/30
                  group-hover:bg-primary/10
                "
              >
                <Layers3
                  className="
                    size-5 text-muted-foreground
                    transition-colors duration-300
                    group-hover:text-primary
                  "
                />
              </div>
  
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="
                      size-8 transition-all duration-200
                      hover:bg-muted
                    "
                    aria-label={`Actions for section ${section.name}`}
                  >
                    <MoreHorizontal className="size-5" />
                  </Button>
                </DropdownMenuTrigger>
  
                <DropdownMenuContent 
                  align="end"
                  className="w-44"
                >
                  <DropdownMenuItem
                    onClick={() => onEdit(section)}
                  >
                    <Pencil className="size-4" />
  
                    Edit Section
                  </DropdownMenuItem>
  
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => onDelete(section)}
                  >
                    <Trash2 className="size-4" />
  
                    Delete Section
                  </DropdownMenuItem>

                </DropdownMenuContent>

              </DropdownMenu>
            </div>
  
            {/* =========================================== */}
            {/* SECTION INFORMATION */}
            {/* =========================================== */}
  
            <div className="mt-6">
              <p
                className="
                  text-xs font-medium uppercase
                  tracking-[0.16em] text-muted-foreground
                  transition-colors duration-300
                  group-hover:text-primary
                "
              >
                Academic Section
              </p>
  
              <h3
                className="
                  mt-2 text-2xl font-semibold tracking-tight
                  transition-transform duration-300
                  group-hover:translate-x-0.5
                "
              >
                {section.name}
              </h3>
  
              <p className="mt-2 text-sm text-muted-foreground">
                Academic section configured for this class.
              </p>

              <div className="mt-5 flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                  <School className="size-4 text-muted-foreground" />
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-semibold">
                    {section.students_count ?? 0}
                  </span>

                  <span className="text-xs text-muted-foreground">
                    Students
                  </span>
                </div>
              </div>
            </div>
  
  
            {/* =========================================== */}
            {/* FOOTER */}
            {/* =========================================== */}
  
            <div
              className="
                mt-5 flex items-center justify-between border-t pt-4
                transition-colors duration-300
                group-hover:border-primary/20
              "
            >
              <span
                className="
                  text-xs text-muted-foreground
                  transition-colors duration-300
                  group-hover:text-foreground
                "
              >
                Section Management
              </span>
  
              <div
                className="
                  flex size-7 items-center justify-center rounded-full bg-muted
                  transition-all duration-300
                  group-hover:scale-110
                  group-hover:bg-primary/10
                "
              >
                <Layers3
                  className="
                    size-3.5 text-muted-foreground
                    transition-colors duration-300
                    group-hover:text-primary
                  "
                />
              </div>
            </div>
          </div>
  
          {/* =========================================== */}
          {/* BOTTOM ACCENT LINE */}
          {/* =========================================== */}
  
          <div
            className="
              absolute bottom-0 left-0 h-0.5 w-0
              bg-primary
              transition-all duration-500 ease-out
              group-hover:w-full
            "
          />
        </section>
      );
    })}
  </div>
  );
}