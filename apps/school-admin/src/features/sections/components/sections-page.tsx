"use client";

import { useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAcademicYears } from "@/features/academic-years/hooks/use-academic-years";

import { useClasses } from "@/features/classes/hooks/use-classes";

import type { SchoolSection } from "../types";

import { useSections } from "../hooks/use-sections";

import { CreateSectionDialog } from "./create-section-dialog";
import { DeleteSectionDialog } from "./delete-section-dialog";
import { EditSectionDialog } from "./edit-section-dialog";
import { SectionsTable } from "./sections-table";

export function SectionsPage() {
  const academicYears =
    useAcademicYears();

  const [
    selectedAcademicYearId,
    setSelectedAcademicYearId,
  ] = useState<string>("");

  const [
    selectedClassId,
    setSelectedClassId,
  ] = useState<string>("");

  /*
   * Automatically select the current
   * academic year.
   */
  useEffect(() => {
    if (
      selectedAcademicYearId !== "" ||
      !academicYears.data?.length
    ) {
      return;
    }

    const currentAcademicYear =
      academicYears.data.find(
        (year) => year.is_current,
      );

    setSelectedAcademicYearId(
      currentAcademicYear?.id ??
        academicYears.data[0].id,
    );
  }, [
    academicYears.data,
    selectedAcademicYearId,
  ]);

  /*
   * Load classes for selected
   * academic year.
   */
  const classesQuery =
    useClasses(
      selectedAcademicYearId,
    );

  const classes =
    classesQuery.data ?? [];

  /*
   * Keep selected class synchronized
   * with the currently loaded classes.
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
          schoolClass.id ===
          selectedClassId,
      );

    if (!selectedClassExists) {
      setSelectedClassId(
        classes[0].id,
      );
    }
  }, [
    classes,
    selectedClassId,
  ]);

  /*
   * Load sections only for the
   * selected class.
   */
  const sectionsQuery =
    useSections(
      selectedClassId || undefined,
    );

  const [
    editingSection,
    setEditingSection,
  ] = useState<SchoolSection | null>(
    null,
  );

  const [
    deletingSection,
    setDeletingSection,
  ] = useState<SchoolSection | null>(
    null,
  );

  const sections =
    sectionsQuery.data ?? [];

  /*
   * Initial loading.
   */
  if (
    academicYears.isPending ||
    classesQuery.isPending
  ) {
    return (
      <div className="p-6">
        <div className="h-96 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  /*
   * Initial loading errors.
   */
  if (
    academicYears.isError ||
    classesQuery.isError
  ) {
    return (
      <div className="p-6">
        <div className="rounded-xl border bg-card p-8">
          <h2 className="text-lg font-semibold">
            Unable to load sections
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Academic year or class
            information could not be
            loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-end justify-between gap-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Sections
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage sections assigned to
              your school classes.
            </p>
          </div>

          <CreateSectionDialog
            classes={classes}
            classesLoading={
              classesQuery.isLoading
            }
          />
        </div>

        {/* Filters */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Academic Year */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Academic Year
            </label>

            <Select
              value={
                selectedAcademicYearId
              }
              onValueChange={(
                academicYearId,
              ) => {
                setSelectedAcademicYearId(
                  academicYearId,
                );

                /*
                 * Clear class immediately.
                 * The effect below will select
                 * the first class from the new
                 * academic year once loaded.
                 */
                setSelectedClassId("");
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select academic year" />
              </SelectTrigger>

              <SelectContent>
                {academicYears.data?.map(
                  (year) => (
                    <SelectItem
                      key={year.id}
                      value={year.id}
                    >
                      {year.name}

                      {year.is_current
                        ? " (Current)"
                        : ""}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Class */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Class
            </label>

            <Select
              value={selectedClassId}
              onValueChange={
                setSelectedClassId
              }
              disabled={
                !selectedAcademicYearId ||
                classes.length === 0
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    classesQuery.isFetching
                      ? "Loading classes..."
                      : classes.length === 0
                        ? "No classes available"
                        : "Select class"
                  }
                />
              </SelectTrigger>

              <SelectContent>
                {classes.map(
                  (schoolClass) => (
                    <SelectItem
                      key={
                        schoolClass.id
                      }
                      value={
                        schoolClass.id
                      }
                    >
                      {schoolClass.name}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content */}
        {classes.length === 0 ? (
          <div className="rounded-xl border bg-card p-8 text-center">
            <h2 className="font-semibold">
              No classes available
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Create a class before
              creating sections.
            </p>
          </div>
        ) : sectionsQuery.isPending ? (
          <div className="h-72 animate-pulse rounded-xl bg-muted" />
        ) : sectionsQuery.isError ? (
          <div className="rounded-xl border bg-card p-8 text-center">
            <h2 className="font-semibold">
              Unable to load sections
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Section data could not be
              loaded.
            </p>
          </div>
        ) : (
          <SectionsTable
            sections={sections}
            classes={classes}
            onEdit={setEditingSection}
            onDelete={setDeletingSection}
          />
        )}
      </div>

      {/* Edit */}
      <EditSectionDialog
        section={editingSection}
        classes={classes}
        open={
          editingSection !== null
        }
        onOpenChange={(open) => {
          if (!open) {
            setEditingSection(null);
          }
        }}
      />

      {/* Delete */}
      <DeleteSectionDialog
        section={deletingSection}
        open={
          deletingSection !== null
        }
        onOpenChange={(open) => {
          if (!open) {
            setDeletingSection(null);
          }
        }}
      />
    </>
  );
}