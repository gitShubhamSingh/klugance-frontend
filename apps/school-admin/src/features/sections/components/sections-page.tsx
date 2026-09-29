"use client";

import {
  AlertCircle,
  CalendarDays,
  Layers3,
  Loader2,
  RefreshCw,
  School,
} from "lucide-react";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import { useAcademicYears } from "@/features/academic-years/hooks/use-academic-years";

import { useClasses } from "@/features/classes/hooks/use-classes";

import type { SchoolSection } from "../types";

import { useSections } from "../hooks/use-sections";

import { CreateSectionDialog } from "./create-section-dialog";
import { DeleteSectionDialog } from "./delete-section-dialog";
import { EditSectionDialog } from "./edit-section-dialog";


import { SectionsGrid } from "./sections-grid";

export function SectionsPage() {
  /*
   * =========================================================
   * CURRENT ACADEMIC YEAR
   * =========================================================
   *
   * API now returns ONE academic year object.
   */

  const academicYearQuery = useAcademicYears();

  const academicYear = academicYearQuery.data;

  const academicYearId = academicYear?.id ?? "";

  /*
   * =========================================================
   * SELECTED CLASS
   * =========================================================
   */

  const [selectedClassId, setSelectedClassId] =
    useState<string>("");

  /*
   * =========================================================
   * LOAD CLASSES FOR CURRENT ACADEMIC YEAR
   * =========================================================
   */

  const classesQuery = useClasses(
    academicYearId,
  );

  const classes = classesQuery.data ?? [];
  const selectedClass = classes.find(
    (schoolClass) =>
      schoolClass.id === selectedClassId,
  );
  /*
   * =========================================================
   * AUTO SELECT FIRST CLASS
   * =========================================================
   *
   * If classes change or current selection no longer exists,
   * automatically select the first available class.
   */

  useEffect(() => {
    if (!classes.length) {
      if (selectedClassId !== "") {
        setSelectedClassId("");
      }

      return;
    }

    const selectedClassExists =
      classes.some(
        (schoolClass) =>
          schoolClass.id === selectedClassId,
      );

    if (!selectedClassExists) {
      setSelectedClassId(classes[0].id);
    }
  }, [classes, selectedClassId]);

  /*
   * =========================================================
   * LOAD SECTIONS
   * =========================================================
   *
   * Sections belong to a class.
   */

  const sectionsQuery = useSections(
    selectedClassId || undefined,
  );

  const sections = sectionsQuery.data ?? [];

  /*
   * =========================================================
   * EDIT / DELETE STATE
   * =========================================================
   */

  const [editingSection, setEditingSection] =
    useState<SchoolSection | null>(null);

  const [deletingSection, setDeletingSection] =
    useState<SchoolSection | null>(null);

  /*
   * =========================================================
   * REFRESH
   * =========================================================
   */

  const handleRefresh = () => {
    void academicYearQuery.refetch();

    if (academicYearId) {
      void classesQuery.refetch();
    }

    if (selectedClassId) {
      void sectionsQuery.refetch();
    }
  };

  /*
   * =========================================================
   * ACADEMIC YEAR LOADING
   * =========================================================
   */

  if (academicYearQuery.isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex min-h-80 items-center justify-center rounded-2xl border bg-card">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  /*
   * =========================================================
   * ACADEMIC YEAR ERROR
   * =========================================================
   */

  if (academicYearQuery.isError) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border bg-card p-8 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10">
            <AlertCircle className="size-7 text-destructive" />
          </div>

          <h2 className="mt-5 text-lg font-semibold">
            Unable to load academic year
          </h2>

          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            The current academic year could not be
            loaded. Sections require an active academic
            session.
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

  /*
   * =========================================================
   * NO ACADEMIC YEAR
   * =========================================================
   */

  if (!academicYear) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border bg-card p-8 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
            <CalendarDays className="size-7 text-muted-foreground" />
          </div>

          <h2 className="mt-5 text-lg font-semibold">
            No Academic Year Available
          </h2>

          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Sections can only be managed when a current
            academic year is configured for the school.
          </p>
        </div>
      </div>
    );
  }

  /*
   * =========================================================
   * MAIN PAGE
   * =========================================================
   */

  return (
    <>
      <div className="space-y-6 p-6">

        {/* ================================================= */}
        {/* PAGE HEADER */}
        {/* ================================================= */}

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

          <div>
            <div className="flex items-center gap-3">

              <div className="flex size-11 items-center justify-center rounded-xl bg-muted">
                <Layers3 className="size-5 text-muted-foreground" />
              </div>

              <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                  Sections
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                  Manage sections for classes in the
                  current academic session.
                </p>
              </div>

            </div>

            {/* ============================================= */}
            {/* CURRENT ACADEMIC YEAR */}
            {/* ============================================= */}

            {/* <div className="mt-4 inline-flex items-center gap-3 rounded-xl border bg-card px-4 py-3">

              <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                <School className="size-4 text-muted-foreground" />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Current Academic Year
                </p>

                <p className="text-sm font-semibold">
                  {academicYear.name}
                </p>
              </div>

              {academicYear.is_current && (
                <span className="size-2 rounded-full bg-primary" />
              )}

            </div> */}
          
          </div>

          {/* =============================================== */}
          {/* ACTIONS */}
          {/* =============================================== */}

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              aria-label="Refresh sections"
              disabled={
                academicYearQuery.isFetching ||
                classesQuery.isFetching ||
                sectionsQuery.isFetching
              }
              onClick={handleRefresh}
            >
              <RefreshCw
                className={
                  academicYearQuery.isFetching ||
                  classesQuery.isFetching ||
                  sectionsQuery.isFetching
                    ? "size-4 animate-spin"
                    : "size-4"
                }
              />
            </Button>
          </div>

        </div>

        {/* ================================================= */}
        {/* CLASSES LOADING */}
        {/* ================================================= */}

        {classesQuery.isLoading ? (
          <div className="flex min-h-72 items-center justify-center rounded-2xl border bg-card">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>

        ) : classesQuery.isError ? (

          /* =============================================== */
          /* CLASSES ERROR */
          /* =============================================== */

          <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border bg-card p-8 text-center">

            <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10">
              <AlertCircle className="size-7 text-destructive" />
            </div>

            <h2 className="mt-5 text-lg font-semibold">
              Unable to load classes
            </h2>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Classes could not be loaded for the current
              academic year.
            </p>

            <Button
              variant="outline"
              className="mt-5"
              onClick={() => {
                void classesQuery.refetch();
              }}
            >
              Try Again
            </Button>

          </div>

        ) : classes.length === 0 ? (

          /* =============================================== */
          /* NO CLASSES */
          /* =============================================== */

          <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border bg-card p-8 text-center">

            <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
              <School className="size-7 text-muted-foreground" />
            </div>

            <h2 className="mt-5 text-lg font-semibold">
              No Classes Available
            </h2>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Create classes for {academicYear.name}
              before managing sections.
            </p>

          </div>

        ) : (

          /* =============================================== */
          /* SECTIONS CONTENT */
          /* =============================================== */

          <>
          {/* ============================================= */}
          {/* CURRENT CLASS INFO */}
          {/* ============================================= */}

          <div className="rounded-2xl border bg-card p-5">
            <div className="flex flex-col gap-5">

              {/* =========================================== */}
              {/* CURRENTLY VIEWING */}
              {/* =========================================== */}

              <div>
                <p className="text-sm text-muted-foreground">
                  Currently Viewing
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  {
                    classes.find(
                      (schoolClass) =>
                        schoolClass.id === selectedClassId,
                    )?.name
                  }
                </h2>
              </div>

              {/* =========================================== */}
              {/* CLASS SELECTOR */}
              {/* =========================================== */}

              <div className="flex flex-wrap gap-2">
                {classes.map((schoolClass) => (
                  <Button
                    key={schoolClass.id}
                    type="button"
                    variant={
                      selectedClassId === schoolClass.id
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
                ))}
              </div>

              {/* =========================================== */}
              {/* SELECTED CLASS ACTION */}
              {/* =========================================== */}

              {selectedClassId && (
                <div className="flex flex-col gap-4 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">

                  <div>
                    <p className="text-sm font-medium">
                      Manage Sections
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Create and manage sections for the
                      selected class.
                    </p>
                  </div>

                  {selectedClass && (
                    <CreateSectionDialog
                      classId={selectedClass.id}
                      className={selectedClass.name}
                    />
                  )}

                </div>
              )}

            </div>
          </div>

            {/* ============================================= */}
            {/* SECTIONS */}
            {/* ============================================= */}

            {sectionsQuery.isLoading ? (

              <div className="flex min-h-72 items-center justify-center rounded-2xl border bg-card">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              </div>

            ) : sectionsQuery.isError ? (

              <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border bg-card p-8 text-center">

                <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10">
                  <AlertCircle className="size-7 text-destructive" />
                </div>

                <h2 className="mt-5 text-lg font-semibold">
                  Unable to load sections
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                  Section data could not be loaded for the
                  selected class.
                </p>

                <Button
                  variant="outline"
                  className="mt-5"
                  onClick={() => {
                    void sectionsQuery.refetch();
                  }}
                >
                  Try Again
                </Button>

              </div>

            ) : (

              <SectionsGrid
                sections={sections}
                classes={classes}
                onEdit={setEditingSection}
                onDelete={setDeletingSection}
              />

            )}
          </>
        )}

      </div>

      {/* ================================================= */}
      {/* EDIT SECTION */}
      {/* ================================================= */}

      <EditSectionDialog
        section={editingSection}
        classes={classes}
        open={editingSection !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditingSection(null);
          }
        }}
      />

      {/* ================================================= */}
      {/* DELETE SECTION */}
      {/* ================================================= */}

      <DeleteSectionDialog
        section={deletingSection}
        open={deletingSection !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingSection(null);
          }
        }}
      />
    </>
  );
}