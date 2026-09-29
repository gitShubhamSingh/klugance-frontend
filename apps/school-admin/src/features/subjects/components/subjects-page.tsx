"use client";

import {
  BookOpen,
  Layers3,
  Loader2,
  RefreshCw,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Button,
} from "@/components/ui/button";

import {
  useAcademicYears,
} from "@/features/academic-years/hooks/use-academic-years";

import {
  useClasses,
} from "@/features/classes/hooks/use-classes";

import type {
  SchoolClass,
} from "@/features/classes/types";

import type {
  Subject,
} from "../types";

import {
  useClassSubjects,
} from "../hooks/use-class-subjects";

import {
  CreateSubjectDialog,
} from "./create-subject-dialog";

import {
  SubjectsGrid,
} from "./subjects-grid";

import {
  EditSubjectDialog,
} from "./edit-subject-dialog";

import {
  DeleteSubjectDialog,
} from "./delete-subject-dialog";

export function SubjectsPage() {
  /* ===================================================== */
  /* STATE */
  /* ===================================================== */

  const [
    selectedClassId,
    setSelectedClassId,
  ] = useState("");

  const [
    editingSubject,
    setEditingSubject,
  ] = useState<Subject | null>(null);

  const [
    deletingSubject,
    setDeletingSubject,
  ] = useState<Subject | null>(null);

  /* ===================================================== */
  /* LOAD ACADEMIC YEAR */
  /* ===================================================== */

  const {
    data: academicYear,
    isLoading: isAcademicYearLoading,
  } = useAcademicYears();

  /* ===================================================== */
  /* LOAD CLASSES */
  /* ===================================================== */

  const academicYearId =
    academicYear?.id ?? "";

  const {
    data: classes = [],
    isLoading: isClassesLoading,
    isFetching: isClassesFetching,
  } = useClasses(academicYearId);

  /* ===================================================== */
  /* AUTO SELECT FIRST CLASS */
  /*
   * Optional but recommended.
   *
   * When page loads, automatically select
   * the first available class.
   */
  /* ===================================================== */

  useEffect(() => {
    if (
      !selectedClassId &&
      classes.length > 0
    ) {
      setSelectedClassId(
        classes[0].id,
      );
    }
  }, [
    classes,
    selectedClassId,
  ]);

  /* ===================================================== */
  /* LOAD CLASS SUBJECTS */
  /* ===================================================== */

  const {
    data: classSubjects = [],
    isLoading: isSubjectsLoading,
    isFetching: isSubjectsFetching,
    refetch: refetchSubjects,
  } = useClassSubjects(
    selectedClassId || undefined,
  );

  /* ===================================================== */
  /* CONVERT CLASS SUBJECT RESPONSE */
  /*
   * API RESPONSE:
   *
   * {
   *   id: classSubjectId,
   *   class_id: "...",
   *   subject_id: "...",
   *   subject: {
   *     id,
   *     name,
   *     code,
   *     description
   *   }
   * }
   *
   * SubjectsGrid expects Subject[]
   */
  /* ===================================================== */

  const subjects = useMemo(() => {
    return classSubjects
      .map(
        (classSubject) =>
          classSubject.subject,
      )
      .filter(
        (
          subject,
        ): subject is Subject =>
          Boolean(subject),
      );
  }, [classSubjects]);

  /* ===================================================== */
  /* SELECTED CLASS */
  /* ===================================================== */

  const selectedClass =
    useMemo<SchoolClass | undefined>(
      () =>
        classes.find(
          (schoolClass) =>
            schoolClass.id ===
            selectedClassId,
        ),
      [
        classes,
        selectedClassId,
      ],
    );

  /* ===================================================== */
  /* REFRESH */
  /* ===================================================== */

  async function handleRefresh() {
    await refetchSubjects();
  }

  const isLoading =
    isAcademicYearLoading ||
    isClassesLoading;

  return (
    <div className="space-y-6 p-6">

      {/* =============================================== */}
      {/* PAGE HEADER */}
      {/* =============================================== */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

        <div className="flex items-center gap-4">

          <div className="flex size-12 items-center justify-center rounded-2xl bg-muted">
            <BookOpen className="size-6 text-muted-foreground" />
          </div>

          <div>

            <h1 className="text-2xl font-semibold tracking-tight">
              Subjects
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage academic subjects across your
              school classes.
            </p>

          </div>

        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Refresh subjects"
          onClick={handleRefresh}
          disabled={
            !selectedClassId ||
            isSubjectsFetching
          }
        >
          <RefreshCw
            className={
              isSubjectsFetching
                ? "size-4 animate-spin"
                : "size-4"
            }
          />
        </Button>

      </div>

      {/* =============================================== */}
      {/* CLASS SELECTION */}
      {/* =============================================== */}

      <section className="relative overflow-hidden rounded-2xl border bg-card">

        {/* Decorative Background */}

        <div
          className="
            absolute right-0 top-0 size-40
            rounded-bl-full bg-muted/40
          "
        />

        <div className="relative p-6">

          <div>

            <h2 className="font-semibold">
              Select Class
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Choose a class to view and manage
              its subjects.
            </p>

          </div>

          {/* =========================================== */}
          {/* LOADING CLASSES */}
          {/* =========================================== */}

          {isLoading ? (

            <div className="flex items-center gap-3 py-6 text-sm text-muted-foreground">

              <Loader2 className="size-4 animate-spin" />

              Loading classes...

            </div>

          ) : classes.length === 0 ? (

            <div className="py-6 text-sm text-muted-foreground">
              No classes are available for the
              current academic year.
            </div>

          ) : (

            <div className="mt-5 flex flex-wrap gap-2">

              {classes.map(
                (schoolClass) => (

                  <Button
                    key={schoolClass.id}
                    type="button"
                    variant={
                      selectedClassId ===
                      schoolClass.id
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => {
                      setSelectedClassId(
                        schoolClass.id,
                      );
                    }}
                  >
                    {schoolClass.name}
                  </Button>

                ),
              )}

            </div>

          )}

        </div>

      </section>

      {/* =============================================== */}
      {/* SELECTED CLASS */}
      {/* =============================================== */}

      {selectedClass && (

        <section className="relative overflow-hidden rounded-2xl border bg-card">

          {/* Decorative Background */}

          <div
            className="
              absolute right-0 top-0 size-32
              rounded-bl-full bg-muted/30
            "
          />

          <div className="relative flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">

            {/* ========================================= */}
            {/* CLASS INFORMATION */}
            {/* ========================================= */}

            <div className="flex items-center gap-4">

              <div className="flex size-12 items-center justify-center rounded-2xl border bg-muted/50">

                <BookOpen className="size-5 text-muted-foreground" />

              </div>

              <div>

                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Selected Class
                </p>

                <h2 className="mt-1 text-xl font-semibold tracking-tight">
                  {selectedClass.name}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Manage subjects configured for
                  this academic class.
                </p>

              </div>

            </div>

            {/* ========================================= */}
            {/* ADD SUBJECT */}
            {/* ========================================= */}

            <CreateSubjectDialog
              classId={selectedClass.id}
              className={selectedClass.name}
            />

          </div>

        </section>

      )}

      {/* =============================================== */}
      {/* SUBJECT HEADER */}
      {/* =============================================== */}

      {selectedClass && (

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <p className="text-sm text-muted-foreground">
              Academic Subjects
            </p>

            <h2 className="mt-1 text-xl font-semibold tracking-tight">
              {selectedClass.name}
            </h2>

          </div>

          <div className="inline-flex w-fit items-center rounded-xl border bg-card px-4 py-2.5">

            <span className="text-sm text-muted-foreground">
              Total Subjects
            </span>

            <span className="ml-3 text-lg font-semibold">

              {isSubjectsLoading
                ? "..."
                : subjects.length}

            </span>

          </div>

        </div>

      )}

      {/* =============================================== */}
      {/* SUBJECT GRID */}
      {/* =============================================== */}

      {!selectedClassId ? (

        <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border bg-card p-8 text-center">

          <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">

            <Layers3 className="size-6 text-muted-foreground" />

          </div>

          <h3 className="mt-5 font-semibold">
            Select a Class
          </h3>

          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Choose a class above to view and manage
            its academic subjects.
          </p>

        </div>

      ) : isSubjectsLoading ? (

        <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border bg-card p-8 text-center">

          <Loader2 className="size-7 animate-spin text-muted-foreground" />

          <p className="mt-4 text-sm text-muted-foreground">
            Loading subjects...
          </p>

        </div>

      ) : (

        <SubjectsGrid
          subjects={subjects}
          onEdit={setEditingSubject}
          onDelete={setDeletingSubject}
        />

      )}

      {/* =============================================== */}
      {/* EDIT SUBJECT */}
      {/* =============================================== */}

      <EditSubjectDialog
        subject={editingSubject}
        classId={selectedClassId}
        open={Boolean(editingSubject)}
        onOpenChange={(open) => {
          if (!open) {
            setEditingSubject(null);
          }
        }}
      />

      {/* =============================================== */}
      {/* DELETE SUBJECT */}
      {/* =============================================== */}

      <DeleteSubjectDialog
        subject={deletingSubject}
        open={Boolean(deletingSubject)}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingSubject(null);
          }
        }}
      />

    </div>
  );
}