"use client";

import {
  BookOpen,
  MoreHorizontal,
  Pencil,
  Trash2,
  UserRound,
  Loader2,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Subject } from "../types";

import { useSubjectClassTeachers } from "../hooks/use-subject-class-teachers";

import { useSubjectTeacherAssignments } from "../hooks/use-subject-teacher-assignments";

type SubjectsGridProps = {
  subjects?: Subject[];

  classId: string;

  onEdit: (subject: Subject) => void;

  onDelete: (subject: Subject) => void;

  onAssignTeacher: (subject: Subject) => void;
};

function getTeacherName(teacher: {
  first_name?: string;
  middle_name?: string | null;
  last_name?: string;
}) {
  return [
    teacher.first_name,
    teacher.middle_name,
    teacher.last_name,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();
}

function SubjectCard({
  subject,
  classId,
  onEdit,
  onDelete,
  onAssignTeacher,
}: {
  subject: Subject;
  classId: string;
  onEdit: (subject: Subject) => void;
  onDelete: (subject: Subject) => void;
  onAssignTeacher: (subject: Subject) => void;
}) {
  /*
   * Get all teachers assigned to this class.
   *
   * This gives us teacher profile details:
   * id, first_name, middle_name, last_name, etc.
   */
  const teachersQuery = useSubjectClassTeachers(
    classId,
    true,
  );

  /*
   * Get teachers assigned to this particular subject.
   *
   * Response contains:
   *
   * {
   *   id,
   *   teacher_profile_id,
   *   subject_id
   * }
   */
  const assignmentsQuery =
    useSubjectTeacherAssignments(
      subject.id,
      true,
    );

  const teachers = teachersQuery.data ?? [];

  const assignments =
    assignmentsQuery.data ?? [];

  /*
   * Resolve teacher_profile_id -> Teacher profile.
   */
  const assignedTeachers = assignments
    .map((assignment) =>
      teachers.find(
        (teacher) =>
          teacher.id ===
          assignment.teacher_profile_id,
      ),
    )
    .filter(Boolean);

  const isTeacherLoading =
    teachersQuery.isLoading ||
    assignmentsQuery.isLoading;

  return (
    <article
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
      {/* TOP RIGHT HOVER IMPACT */}

      <div
        className="
          absolute right-0 top-0 size-28 rounded-bl-full
          bg-muted/40
          transition-all duration-500 ease-out
          group-hover:scale-125
          group-hover:bg-primary/10
        "
      />

      {/* SUBTLE HOVER GLOW */}

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
        {/* CARD HEADER */}

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
                onClick={() =>
                  onAssignTeacher(subject)
                }
              >
                <UserRound className="size-4" />
                Assign Teacher
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

        {/* SUBJECT INFORMATION */}

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

        {/* TEACHER ASSIGNMENT */}

        <div
          className="
            mt-6 border-t pt-4
            transition-colors duration-300
            group-hover:border-primary/20
          "
        >
          <div className="flex items-center gap-2">
            <Users className="size-4 text-muted-foreground" />

            <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Assigned Teacher
            </p>
          </div>

          {isTeacherLoading ? (
            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Loading teacher...
            </div>
          ) : assignedTeachers.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              No teacher assigned
            </p>
          ) : (
            <div className="mt-3 space-y-2">
              {assignedTeachers.map(
                (teacher) => {
                  if (!teacher) {
                    return null;
                  }

                  return (
                    <div
                      key={teacher.id}
                      className="flex items-center gap-2"
                    >
                      <div
                        className="
                          flex size-7 shrink-0
                          items-center justify-center
                          rounded-full
                          bg-primary/10
                          text-xs font-semibold
                          text-primary
                        "
                      >
                        {teacher.first_name?.charAt(
                          0,
                        )}
                        {teacher.last_name?.charAt(
                          0,
                        )}
                      </div>

                      <p className="truncate text-sm font-medium">
                        {getTeacherName(
                          teacher,
                        )}
                      </p>
                    </div>
                  );
                },
              )}
            </div>
          )}
        </div>

        {/* FOOTER */}

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

      {/* BOTTOM ACCENT LINE */}

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
}

export function SubjectsGrid({
  subjects = [],
  classId,
  onEdit,
  onDelete,
  onAssignTeacher,
}: SubjectsGridProps) {
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
          No subjects have been configured for
          this class yet.
        </p>
      </div>
    );
  }

  return (
    <div className="group/classes grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {subjects.map((subject) => (
        <SubjectCard
          key={subject.id}
          subject={subject}
          classId={classId}
          onEdit={onEdit}
          onDelete={onDelete}
          onAssignTeacher={onAssignTeacher}
        />
      ))}
    </div>
  );
}