"use client";

import {
    AlertCircle,
    BookOpen,
    Loader2,
    Plus,
    RefreshCw,
    Trash2,
  } from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  useAcademicYears,
} from "@/features/academic-years/hooks/use-academic-years";

import {
  useClasses,
} from "@/features/classes/hooks/use-classes";

import {
  useTeacherClassAssignments,
} from "../hooks/use-teacher-class-assignments";

import {
  useDeleteTeacherClassAssignment,
} from "../hooks/use-delete-teacher-class-assignment";

import {
    useCreateTeacherClassAssignment,
  } from "../hooks/use-create-teacher-class-assignment";

import {
    Checkbox,
  } from "@/components/ui/checkbox";
import type {
  Teacher,
} from "../types";

import type {
  TeacherClassAssignment,
} from "../api";

type Props = {
  teacher: Teacher | null;

  open: boolean;

  onOpenChange: (
    open: boolean,
  ) => void;
};

function getTeacherName(
  teacher: Teacher,
): string {
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

export function AssignTeacherDialog({
  teacher,
  open,
  onOpenChange,
}: Props) {

    const createAssignmentMutation =
    useCreateTeacherClassAssignment();

    const [
    isAddClassOpen,
    setIsAddClassOpen,
    ] = useState(false);

    const [
    selectedClassIds,
    setSelectedClassIds,
    ] = useState<string[]>([]);
  /* ===================================================== */
  /* DELETE MUTATION */
  /* ===================================================== */

  const deleteAssignmentMutation =
    useDeleteTeacherClassAssignment();

  const [
    assignmentToDelete,
    setAssignmentToDelete,
  ] = useState<TeacherClassAssignment | null>(
    null,
  );

  /* ===================================================== */
  /* CURRENT ACADEMIC YEAR */
  /* ===================================================== */

  const academicYearQuery =
    useAcademicYears();

  const academicYearId =
    academicYearQuery.data?.id ?? "";

  /* ===================================================== */
  /* CLASSES */
  /* ===================================================== */

  const classesQuery =
    useClasses(
      academicYearId,
    );

  const classes =
    classesQuery.data ?? [];

  /* ===================================================== */
  /* TEACHER CLASS ASSIGNMENTS */
  /* ===================================================== */

  const assignmentsQuery =
    useTeacherClassAssignments(
      teacher?.id ?? null,
      open,
    );

  const assignments =
    assignmentsQuery.data ?? [];

  /* ===================================================== */
  /* RESOLVE CLASS IDS */
  /* ===================================================== */

  const assignedClasses =
    useMemo(() => {
      const classMap =
        new Map(
          classes.map(
            (schoolClass) => [
              schoolClass.id,
              schoolClass,
            ],
          ),
        );

      return assignments.map(
        (assignment) => ({
          assignment,
          schoolClass:
            classMap.get(
              assignment.class_id,
            ),
        }),
      );
    }, [
      assignments,
      classes,
    ]);

    const assignedClassIds =
    useMemo(() => {
        return new Set(
        assignments.map(
            (assignment) =>
            assignment.class_id,
        ),
        );
    }, [assignments]);

    const availableClasses =
    useMemo(() => {
        return classes.filter(
        (schoolClass) =>
            !assignedClassIds.has(
            schoolClass.id,
            ),
        );
    }, [
        classes,
        assignedClassIds,
    ]);

  /* ===================================================== */
  /* REFRESH */
  /* ===================================================== */

  const handleRefresh = () => {
    void assignmentsQuery.refetch();
  };

  /* ===================================================== */
  /* TEACHER NAME */
  /* ===================================================== */

  const teacherName =
    teacher
      ? getTeacherName(teacher)
      : "Teacher";

  /* ===================================================== */
  /* DELETE CONFIRMATION */
  /* ===================================================== */

  const handleDelete = async () => {
    if (!assignmentToDelete) {
      return;
    }

    try {
      await deleteAssignmentMutation.mutateAsync(
        assignmentToDelete.id,
      );

      /*
       * Close confirmation dialog.
       */
      setAssignmentToDelete(null);

      /*
       * Refresh assignments while
       * keeping the main dialog open.
       */
      await assignmentsQuery.refetch();
    } catch (error) {
      console.error(
        "Failed to delete teacher class assignment:",
        error,
      );
    }
  };

  /* ===================================================== */
  /* RENDER */
  /* ===================================================== */

  return (
    <>
      {/* =================================================== */}
      {/* MAIN TEACHER ASSIGNMENTS DIALOG */}
      {/* =================================================== */}

      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (
            deleteAssignmentMutation.isPending
          ) {
            return;
          }

          if (!nextOpen) {
            setAssignmentToDelete(null);
          }

          onOpenChange(nextOpen);
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Teacher Assignments
            </DialogTitle>

            <DialogDescription>
              View the classes currently assigned
              to{" "}
              <span className="font-medium text-foreground">
                {teacherName}
              </span>
              .
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* =========================================== */}
            {/* TEACHER HEADER */}
            {/* =========================================== */}

            {teacher && (
              <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {teacher.first_name
                    ?.charAt(0)
                    .toUpperCase()}

                  {teacher.last_name
                    ?.charAt(0)
                    .toUpperCase()}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {teacherName}
                  </p>

                  <p className="truncate text-xs text-muted-foreground">
                    {teacher.employee_code}
                  </p>
                </div>
              </div>
            )}

            {/* =========================================== */}
            {/* LOADING */}
            {/* =========================================== */}

            {assignmentsQuery.isLoading && (
              <div className="flex min-h-40 items-center justify-center rounded-xl border">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="size-5 animate-spin text-muted-foreground" />

                  <p className="text-sm text-muted-foreground">
                    Loading assignments...
                  </p>
                </div>
              </div>
            )}

            {/* =========================================== */}
            {/* ERROR */}
            {/* =========================================== */}

            {!assignmentsQuery.isLoading &&
              assignmentsQuery.isError && (
                <div className="flex min-h-40 flex-col items-center justify-center rounded-xl border p-6 text-center">
                  <div className="flex size-10 items-center justify-center rounded-full bg-destructive/10">
                    <AlertCircle className="size-5 text-destructive" />
                  </div>

                  <h3 className="mt-3 text-sm font-semibold">
                    Unable to load assignments
                  </h3>

                  <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                    The teacher's class assignments
                    could not be loaded.
                  </p>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={handleRefresh}
                  >
                    <RefreshCw className="size-4" />

                    Try Again
                  </Button>
                </div>
              )}

            {/* =========================================== */}
            {/* SUCCESS */}
            {/* =========================================== */}

            {!assignmentsQuery.isLoading &&
              !assignmentsQuery.isError && (
                <>
                  {/* ===================================== */}
                  {/* EMPTY */}
                  {/* ===================================== */}

                  {assignments.length === 0 ? (
                    <div className="flex min-h-40 flex-col items-center justify-center rounded-xl border p-6 text-center">
                      <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                        <BookOpen className="size-5 text-muted-foreground" />
                      </div>

                      <h3 className="mt-3 text-sm font-semibold">
                        No class assignments
                      </h3>

                      <p className="mt-1 text-xs text-muted-foreground">
                        This teacher has not been
                        assigned to any class yet.
                      </p>
                    </div>
                  ) : (
                    /* =================================== */
                    /* ASSIGNED CLASSES */
                    /* =================================== */

                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-sm font-medium">
                            Assigned Classes
                            </p>

                            <p className="text-xs text-muted-foreground">
                            {assignments.length}{" "}
                            {assignments.length === 1
                                ? "class"
                                : "classes"}{" "}
                            assigned
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                            type="button"
                            size="sm"
                            onClick={() => {
                                setSelectedClassIds([]);
                                setIsAddClassOpen(true);
                            }}
                            disabled={
                                classesQuery.isLoading ||
                                availableClasses.length === 0
                            }
                            >
                            <Plus className="size-4" />

                            Assign Class
                            </Button>

                            <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            onClick={handleRefresh}
                            disabled={
                                assignmentsQuery.isFetching
                            }
                            aria-label="Refresh assignments"
                            >
                            <RefreshCw
                                className={
                                assignmentsQuery.isFetching
                                    ? "size-4 animate-spin"
                                    : "size-4"
                                }
                            />
                            </Button>
                        </div>
                        </div>

                      <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                        {assignedClasses.map(
                          ({
                            assignment,
                            schoolClass,
                          }) => (
                            <div
                              key={
                                assignment.id
                              }
                              className="flex items-center gap-3 rounded-lg border p-3"
                            >
                              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                <BookOpen className="size-4 text-primary" />
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">
                                  {schoolClass?.name ??
                                    "Unknown Class"}
                                </p>

                                {schoolClass?.code && (
                                  <p className="text-xs text-muted-foreground">
                                    {
                                      schoolClass.code
                                    }
                                  </p>
                                )}
                              </div>

                              {/* ========================= */}
                              {/* DELETE BUTTON */}
                              {/* ========================= */}

                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-8 shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                onClick={() => {
                                  setAssignmentToDelete(
                                    assignment,
                                  );
                                }}
                                disabled={
                                  deleteAssignmentMutation.isPending
                                }
                                aria-label={`Remove ${
                                  schoolClass?.name ??
                                  "class"
                                } assignment`}
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

            {/* =========================================== */}
            {/* CLASS DETAILS LOADING */}
            {/* =========================================== */}

            {!assignmentsQuery.isLoading &&
              !assignmentsQuery.isError &&
              assignments.length > 0 &&
              classesQuery.isLoading && (
                <p className="text-xs text-muted-foreground">
                  Loading class details...
                </p>
              )}
          </div>
        </DialogContent>
      </Dialog>

      {/* =================================================== */}
      {/* DELETE CONFIRMATION DIALOG */}
      {/* =================================================== */}

      <Dialog
        open={assignmentToDelete !== null}
        onOpenChange={(nextOpen) => {
          if (
            deleteAssignmentMutation.isPending
          ) {
            return;
          }

          if (!nextOpen) {
            setAssignmentToDelete(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Remove Class Assignment?
            </DialogTitle>

            <DialogDescription>
              Are you sure you want to remove{" "}
              <span className="font-medium text-foreground">
                {
                  assignedClasses.find(
                    ({ assignment }) =>
                      assignment.id ===
                      assignmentToDelete?.id,
                  )?.schoolClass?.name ??
                  "this class"
                }
              </span>{" "}
              from this teacher's assignments?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setAssignmentToDelete(null);
              }}
              disabled={
                deleteAssignmentMutation.isPending
              }
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={
                deleteAssignmentMutation.isPending
              }
            >
              {deleteAssignmentMutation.isPending && (
                <Loader2 className="size-4 animate-spin" />
              )}

              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* =================================================== */}
{/* ADD CLASS DIALOG */}
{/* =================================================== */}

<Dialog
  open={isAddClassOpen}
  onOpenChange={(nextOpen) => {
    if (
      createAssignmentMutation.isPending
    ) {
      return;
    }

    setIsAddClassOpen(nextOpen);

    if (!nextOpen) {
      setSelectedClassIds([]);
    }
  }}
>
  <DialogContent className="sm:max-w-lg">
    <DialogHeader>
      <DialogTitle>
        Assign Classes
      </DialogTitle>

      <DialogDescription>
        Select the classes you want to assign
        to{" "}
        <span className="font-medium text-foreground">
          {teacherName}
        </span>
        .
      </DialogDescription>
    </DialogHeader>

    {/* =============================================== */}
    {/* AVAILABLE CLASSES */}
    {/* =============================================== */}

    {classesQuery.isLoading ? (
      <div className="flex min-h-40 items-center justify-center rounded-xl border">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />

          Loading classes...
        </div>
      </div>
    ) : classesQuery.isError ? (
      <div className="flex min-h-40 flex-col items-center justify-center rounded-xl border p-6 text-center">
        <div className="flex size-10 items-center justify-center rounded-xl bg-destructive/10">
          <AlertCircle className="size-5 text-destructive" />
        </div>

        <p className="mt-3 text-sm font-medium">
          Unable to load classes
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          Please try again.
        </p>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => {
            void classesQuery.refetch();
          }}
        >
          Try Again
        </Button>
      </div>
    ) : availableClasses.length === 0 ? (
      <div className="flex min-h-40 flex-col items-center justify-center rounded-xl border p-6 text-center">
        <div className="flex size-10 items-center justify-center rounded-xl bg-muted">
          <BookOpen className="size-5 text-muted-foreground" />
        </div>

        <p className="mt-3 text-sm font-medium">
          No classes available
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          All available classes are already
          assigned to this teacher.
        </p>
      </div>
    ) : (
      <div className="max-h-80 overflow-y-auto rounded-xl border">
        <div className="divide-y">
          {availableClasses.map(
            (schoolClass) => {
              const checked =
                selectedClassIds.includes(
                  schoolClass.id,
                );

              return (
                <label
                  key={schoolClass.id}
                  className={[
                    "flex cursor-pointer items-center gap-3 p-3",
                    "transition-colors",
                    "hover:bg-muted/50",
                    checked
                      ? "bg-primary/5"
                      : "",
                  ].join(" ")}
                >
                  <Checkbox
                    checked={checked}
                    disabled={
                      createAssignmentMutation.isPending
                    }
                    onCheckedChange={(
                      value,
                    ) => {
                      setSelectedClassIds(
                        (current) => {
                          if (value === true) {
                            return [
                              ...current,
                              schoolClass.id,
                            ];
                          }

                          return current.filter(
                            (id) =>
                              id !==
                              schoolClass.id,
                          );
                        },
                      );
                    }}
                  />

                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <BookOpen className="size-4 text-primary" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {schoolClass.name}
                    </p>

                    {schoolClass.code && (
                      <p className="text-xs text-muted-foreground">
                        {schoolClass.code}
                      </p>
                    )}
                  </div>
                </label>
              );
            },
          )}
        </div>
      </div>
    )}

    {/* =============================================== */}
    {/* FOOTER */}
    {/* =============================================== */}

    <DialogFooter>
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          setIsAddClassOpen(false);
          setSelectedClassIds([]);
        }}
        disabled={
          createAssignmentMutation.isPending
        }
      >
        Cancel
      </Button>

      <Button
        type="button"
        disabled={
          selectedClassIds.length === 0 ||
          createAssignmentMutation.isPending
        }
        onClick={async () => {
          if (
            !teacher ||
            selectedClassIds.length === 0
          ) {
            return;
          }

          try {
            /*
             * The backend accepts ONE class_id
             * per request.
             *
             * teacher_ids remains an array,
             * containing the current teacher.
             */

            for (
              const classId of selectedClassIds
            ) {
              await createAssignmentMutation.mutateAsync(
                {
                  teacher_ids: [
                    teacher.id,
                  ],
                  class_id: classId,
                },
              );
            }

            /*
             * Close Add Class dialog.
             */
            setIsAddClassOpen(false);

            setSelectedClassIds([]);

            /*
             * Refresh the assignments list
             * while keeping the main dialog open.
             */
            await assignmentsQuery.refetch();
          } catch (error) {
            console.error(
              "Failed to assign teacher to class:",
              error,
            );
          }
        }}
      >
        {createAssignmentMutation.isPending && (
          <Loader2 className="size-4 animate-spin" />
        )}

        Assign
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
    </>
  );
}