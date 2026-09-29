"use client";

import {
  BookOpen,
  GraduationCap,
  MoreHorizontal,
  Pencil,
  Trash2,
  Users,
  BookMarked,
  PanelsTopLeft,
  UserRoundPlus,
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

import type { SchoolClass } from "../types";

type Props = {
  classes?: SchoolClass[];

  academicYearName: string;

  onEdit: (
    schoolClass: SchoolClass,
  ) => void;

  onDelete: (
    schoolClass: SchoolClass,
  ) => void;
  onAssignTeacher: (
    schoolClass: SchoolClass,
  ) => void;
};

export function ClassesGrid({
  classes = [],
  academicYearName,
  onEdit,
  onDelete,
  onAssignTeacher,
}: Props) {
  if (classes.length === 0) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border bg-card p-8 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
          <GraduationCap className="size-8 text-muted-foreground" />
        </div>

        <h3 className="mt-5 text-lg font-semibold">
          No Classes Created Yet
        </h3>

        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          Classes have not been configured for{" "}
          <span className="font-medium text-foreground">
            {academicYearName}
          </span>{" "}
          yet. Create classes to begin organizing your
          school's academic structure.
        </p>
      </div>
    );
  }

  return (
    <div className="group/classes grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {classes.map((schoolClass) => {

        const teachersCount =
          schoolClass.teachers_count ?? 0;

        const subjectsCount =
          schoolClass.subjects_count ?? 0;

        const sectionsCount =
          schoolClass.sections_count ?? 0;

        
        const studentCount = 
          schoolClass.students_count ?? 0;

        return (
          <article
            key={schoolClass.id}
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
            {/* ========================================= */}
            {/* DECORATIVE BACKGROUND */}
            {/* ========================================= */}

            <div
              className="
                absolute right-0 top-0 size-28
                rounded-bl-full bg-muted/40
                transition-all duration-500 ease-out
                group-hover:scale-125
                group-hover:bg-primary/10
              "
            />

            {/* ========================================= */}
            {/* HOVER GLOW */}
            {/* ========================================= */}

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

              {/* ======================================= */}
              {/* CARD HEADER */}
              {/* ======================================= */}

              <div className="flex items-start justify-between gap-4">

                <div
                  className="
                    flex size-11 items-center justify-center
                    rounded-xl border bg-muted/50
                    transition-all duration-300
                    group-hover:scale-110
                    group-hover:border-primary/30
                    group-hover:bg-primary/10
                  "
                >
                  <BookOpen
                    className="
                      size-5 text-muted-foreground
                      transition-colors duration-300
                      group-hover:text-primary
                    "
                  />
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="
                          size-8
                          transition-all duration-200
                          hover:bg-muted
                        "
                        aria-label={`Actions for ${schoolClass.name}`}
                      >
                        <MoreHorizontal className="size-4" />
                      </Button>
                    }
                  />

                  <DropdownMenuContent
                    align="end"
                    className="w-44"
                  >
                    <DropdownMenuGroup>

                      <DropdownMenuItem
                        onClick={() => {
                          onEdit(schoolClass);
                        }}
                      >
                        <Pencil className="size-4" />

                        Edit Class
                      </DropdownMenuItem>
                      
                      {/* <DropdownMenuItem
                        onClick={() => {
                          onAssignTeacher(schoolClass);
                        }}
                      >
                        <UserRoundPlus className="size-4" />

                        Assign Teacher
                      </DropdownMenuItem> */}
                      
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => {
                          onDelete(schoolClass);
                        }}
                      >
                        <Trash2 className="size-4" />

                        Delete Class
                      </DropdownMenuItem>

                    </DropdownMenuGroup>

                  </DropdownMenuContent>
                  
                </DropdownMenu>

              </div>

              {/* ======================================= */}
              {/* CLASS INFORMATION */}
              {/* ======================================= */}

              <div className="mt-6">

                <p
                  className="
                    text-xs font-medium uppercase
                    tracking-[0.16em]
                    text-muted-foreground
                    transition-colors duration-300
                    group-hover:text-primary
                  "
                >
                  Academic Class
                </p>

                <h3
                  className="
                    mt-2 text-2xl font-semibold
                    tracking-tight
                    transition-transform duration-300
                    group-hover:translate-x-0.5
                  "
                >
                  {schoolClass.name}
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  {schoolClass.description ||
                    "Part of the current academic structure."}
                </p>

              </div>

              {/* ======================================= */}
              {/* CLASS STATISTICS */}
              {/* ======================================= */}

              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
                {/* Teachers */}

                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                    <Users className="size-4 text-muted-foreground" />
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-semibold">
                      {teachersCount}
                    </span>

                    <span className="text-xs text-muted-foreground">
                      Teachers
                    </span>
                  </div>
                </div>

                {/* Subjects */}

                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                    <BookMarked className="size-4 text-muted-foreground" />
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-semibold">
                      {subjectsCount}
                    </span>

                    <span className="text-xs text-muted-foreground">
                      Subjects
                    </span>
                  </div>
                </div>

                {/* Sections */}

                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                    <PanelsTopLeft className="size-4 text-muted-foreground" />
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-semibold">
                      {sectionsCount}
                    </span>

                    <span className="text-xs text-muted-foreground">
                      Sections
                    </span>
                  </div>
                </div>

                {/* Students */}

                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                    <PanelsTopLeft className="size-4 text-muted-foreground" />
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-semibold">
                      {studentCount}
                    </span>

                    <span className="text-xs text-muted-foreground">
                      Students
                    </span>
                  </div>
                </div>
              </div>

              {/* ======================================= */}
              {/* FOOTER */}
              {/* ======================================= */}

              <div className="flex items-center justify-between pt-4">

                <Badge
                  variant="secondary"
                  className="
                    rounded-full px-3
                    transition-all duration-300
                    group-hover:bg-primary/20
                    group-hover:text-primary
                  "
                >
                  Active
                </Badge>

                <span
                  className="
                    text-xs text-muted-foreground
                    transition-colors duration-300
                    group-hover:text-foreground
                  "
                >
                  {academicYearName}
                </span>

              </div>

            </div>

            {/* ========================================= */}
            {/* BOTTOM ACCENT */}
            {/* ========================================= */}

            <div
              className="
                absolute bottom-0 left-0 h-0.5 w-0
                bg-primary
                transition-all duration-500 ease-out
                group-hover:w-full
              "
            />

          </article>
        );
      })}
    </div>
  );
}