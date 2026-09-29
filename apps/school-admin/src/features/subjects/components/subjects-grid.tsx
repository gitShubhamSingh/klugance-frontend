"use client";

import {
  BookOpen,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  Button,
} from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type {
  Subject,
} from "../types";

type SubjectsGridProps = {
  subjects?: Subject[];

  onEdit: (
    subject: Subject,
  ) => void;

  onDelete: (
    subject: Subject,
  ) => void;
};

export function SubjectsGrid({
  subjects = [],
  onEdit,
  onDelete,
}: SubjectsGridProps) {
  /* =============================================== */
  /* EMPTY STATE */
  /* =============================================== */

  if (!subjects.length) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border bg-card p-8 text-center">

        <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
          <BookOpen className="size-7 text-muted-foreground" />
        </div>

        <h3 className="mt-5 text-lg font-semibold">
          No Subjects Available
        </h3>

        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          No subjects have been configured for this class yet.
        </p>

      </div>
    );
  }

  /* =============================================== */
  /* SUBJECT GRID */
  /* =============================================== */

  return (
    <div className="group/classes grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

      {subjects.map((subject) => (
        <article
          key={subject.id}
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
                  flex size-11 shrink-0 items-center justify-center
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
                      aria-label={`Actions for ${subject.name}`}
                    >
                      <MoreHorizontal className="size-4" />
                    </Button>
                  }
                />

                <DropdownMenuContent 
                  align="end"
                  className="w-44"
                >

                  <DropdownMenuItem
                    onClick={() =>
                      onEdit(subject)
                    }
                  >
                    <Pencil className="size-4" />

                    Edit Subject
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() =>
                      onDelete(subject)
                    }
                  >
                    <Trash2 className="size-4" />

                    Delete Subject
                  </DropdownMenuItem>

                </DropdownMenuContent>

              </DropdownMenu>

            </div>

            {/* =========================================== */}
            {/* SUBJECT INFORMATION */}
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
                Academic Subject
              </p>

              <h3
                className="
                  mt-2 text-xl font-semibold tracking-tight
                  transition-transform duration-300
                  group-hover:translate-x-0.5
                "
              >
                {subject.name}
              </h3>

              {subject.code ? (
                <p
                  className="
                    mt-2 text-xs font-medium uppercase tracking-wider
                    text-muted-foreground
                    transition-colors duration-300
                    group-hover:text-primary/80
                  "
                >
                  {subject.code}
                </p>
              ) : null}

              {subject.description ? (
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
                  {subject.description}
                </p>
              ) : null}

            </div>

            {/* =========================================== */}
            {/* FOOTER */}
            {/* =========================================== */}

            <div
              className="
                mt-6 border-t pt-4
                transition-colors duration-300
                group-hover:border-primary/20
              "
            >

              <p
                className="
                  text-xs text-muted-foreground
                  transition-colors duration-300
                  group-hover:text-foreground
                "
              >
                Academic Subject
              </p>

              <div className="mt-1 flex items-center justify-between gap-3">

                <p className="text-sm font-medium">
                  Active for this class
                </p>

                <div
                  className="
                    flex size-7 shrink-0 items-center justify-center
                    rounded-full bg-muted
                    transition-all duration-300
                    group-hover:scale-110
                    group-hover:bg-primary/10
                  "
                >
                  <BookOpen
                    className="
                      size-3.5 text-muted-foreground
                      transition-colors duration-300
                      group-hover:text-primary
                    "
                  />
                </div>

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

        </article>
      ))}

    </div>
  );
}