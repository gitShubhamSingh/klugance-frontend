"use client";

import {
  AlertCircle,
  CalendarDays,
  GraduationCap,
  Loader2,
  RefreshCw,
} from "lucide-react";

import { useState } from "react";
import {toast} from "sonner";

import { Button } from "@/components/ui/button";

import { useAcademicYears } from "@/features/academic-years/hooks/use-academic-years";
import { useClasses } from "../hooks/use-classes";
import { useAssignTeachers } from "../hooks/use-assign-teachers";

import type { SchoolClass } from "../types";

import { ClassesGrid } from "./classes-grid";
import { CreateClassDialog } from "./create-class-dialog";
import { DeleteClassDialog } from "./delete-class-dialog";
import { EditClassDialog } from "./edit-class-dialog";
import { AssignTeacherDialog } from "./assign-teacher-dialog";


export function ClassesPage() {
  /* ===================================================== */
  /* CURRENT ACADEMIC YEAR */
  /* ===================================================== */

  const academicYearQuery = useAcademicYears();

  const academicYear = academicYearQuery.data;

  const academicYearId = academicYear?.id ?? "";

  /* ===================================================== */
  /* CLASSES */
  /* ===================================================== */

  const classesQuery = useClasses(
    academicYearId,
  );

  const classes = classesQuery.data ?? [];
  const assignTeachersMutation = useAssignTeachers();

  /* ===================================================== */
  /* EDIT / DELETE STATE */
  /* ===================================================== */

  const [editing, setEditing] =
    useState<SchoolClass | null>(null);

  const [deleting, setDeleting] =
    useState<SchoolClass | null>(null);
  
  const [assigningTeacherClass, setAssigningTeacherClass] =
    useState<SchoolClass | null>(null);

  /* ===================================================== */
  /* REFRESH */
  /* ===================================================== */

  const handleRefresh = async () => {
    const result =
      await academicYearQuery.refetch();

    const refreshedAcademicYear =
      result.data;

    if (refreshedAcademicYear?.id) {
      await classesQuery.refetch();
    }
  };

  /* ===================================================== */
  /* ACADEMIC YEAR LOADING */
  /* ===================================================== */

  if (academicYearQuery.isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex min-h-80 items-center justify-center rounded-2xl border bg-card">
          <Loader2 className="size-7 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  /* ===================================================== */
  /* ACADEMIC YEAR ERROR */
  /* ===================================================== */

  if (academicYearQuery.isError) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border bg-card p-8 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10">
            <AlertCircle className="size-7 text-destructive" />
          </div>

          <h3 className="mt-5 text-lg font-semibold">
            Unable to Load Academic Year
          </h3>

          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            The current academic year could not be loaded.
            Classes cannot be managed without an active
            academic session.
          </p>

          <Button
            variant="outline"
            className="mt-5"
            onClick={() => {
              void academicYearQuery.refetch();
            }}
          >
            <RefreshCw className="size-4" />

            Try Again
          </Button>
        </div>
      </div>
    );
  }

  /* ===================================================== */
  /* NO ACTIVE ACADEMIC YEAR */
  /* ===================================================== */

  if (!academicYear) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border bg-card p-8 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
            <CalendarDays className="size-7 text-muted-foreground" />
          </div>

          <h3 className="mt-5 text-lg font-semibold">
            No Active Academic Year
          </h3>

          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Create and activate an academic year before
            managing classes.
          </p>
        </div>
      </div>
    );
  }

  /* ===================================================== */
  /* PAGE */
  /* ===================================================== */

  return (
    <>
      <div className="space-y-6 p-6">

        {/* ============================================= */}
        {/* PAGE HEADER */}
        {/* ============================================= */}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

          <div className="flex items-center gap-4">

            <div className="flex size-12 items-center justify-center rounded-2xl bg-muted">
              <GraduationCap className="size-6 text-muted-foreground" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Classes
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                Manage classes for your current academic year.
              </p>
            </div>

          </div>

          <div className="flex items-center gap-2">

            {/* Refresh */}

            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Refresh classes"
              disabled={classesQuery.isFetching}
              onClick={() => {
                void handleRefresh();
              }}
            >
              <RefreshCw
                className={
                  classesQuery.isFetching
                    ? "size-4 animate-spin"
                    : "size-4"
                }
              />
            </Button>

            {/* Add Class */}

            <CreateClassDialog
              academicYearId={academicYear.id}
            />

          </div>

        </div>

        {/* ============================================= */}
        {/* ACTIVE ACADEMIC YEAR */}
        {/* ============================================= */}

        <section className="relative overflow-hidden rounded-2xl border bg-card">

          <div
            className="
              absolute right-0 top-0 size-32
              rounded-bl-full bg-muted/40
            "
          />

          <div className="relative flex items-center gap-4 p-5">

            <div className="flex size-11 items-center justify-center rounded-xl border bg-muted/50">
              <CalendarDays className="size-5 text-muted-foreground" />
            </div>

            <div>

              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Active Academic Year
              </p>

              <h2 className="mt-1 text-lg font-semibold tracking-tight">
                {academicYear.name}
              </h2>

            </div>

          </div>

        </section>

        {/* ============================================= */}
        {/* CLASSES LOADING */}
        {/* ============================================= */}

        {classesQuery.isLoading && (
          <div className="flex min-h-80 items-center justify-center rounded-2xl border bg-card">
            <Loader2 className="size-7 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* ============================================= */}
        {/* CLASSES ERROR */}
        {/* ============================================= */}

        {classesQuery.isError && (
          <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border bg-card p-8 text-center">

            <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10">
              <AlertCircle className="size-7 text-destructive" />
            </div>

            <h3 className="mt-5 text-lg font-semibold">
              Unable to Load Classes
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Class data could not be loaded for the
              current academic year.
            </p>

            <Button
              variant="outline"
              className="mt-5"
              onClick={() => {
                void classesQuery.refetch();
              }}
            >
              <RefreshCw className="size-4" />

              Try Again
            </Button>

          </div>
        )}

        {/* ============================================= */}
        {/* CLASSES GRID */}
        {/* ============================================= */}

        {!classesQuery.isLoading &&
          !classesQuery.isError && (
            <ClassesGrid
              classes={classes}
              academicYearName={
                academicYear.name
              }
              onEdit={setEditing}
              onDelete={setDeleting}
              onAssignTeacher={setAssigningTeacherClass}
            />
          )}

      </div>

      {/* =============================================== */}
      {/* EDIT DIALOG */}
      {/* =============================================== */}

      <EditClassDialog
        schoolClass={editing}
        open={editing !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditing(null);
          }
        }}
      />

      {/* =============================================== */}
      {/* DELETE DIALOG */}
      {/* =============================================== */}

      <DeleteClassDialog
        schoolClass={deleting}
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleting(null);
          }
        }}
      />
      
      <AssignTeacherDialog
        schoolClass={assigningTeacherClass}
        open={assigningTeacherClass !== null}
        onOpenChange={(open) => {
          if (!open) {
            setAssigningTeacherClass(null);
          }
        }}
        onAssign={async (classId, teacherIds) => {
          try {
            await assignTeachersMutation.mutateAsync({
              class_id: classId,
              teacher_ids: teacherIds,
            });

            toast.success("Teachers assigned successfully.");
          } catch (error) {
            console.error(
              "Failed to assign teachers:",
              error,
            );

            toast.error(
              "Failed to assign teachers. Please try again.",
            );

            throw error;
          }
        }}
      />
    </>
  );
}