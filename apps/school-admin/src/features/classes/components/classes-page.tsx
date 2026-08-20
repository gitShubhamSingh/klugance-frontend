"use client";

import {
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  useAcademicYears,
} from "@/features/academic-years/hooks/use-academic-years";

import {
  useClasses,
} from "../hooks/use-classes";

import type {
  SchoolClass,
} from "../types";

import {
  ClassesTable,
} from "./classes-table";

import {
  CreateClassDialog,
} from "./create-class-dialog";

import {
  DeleteClassDialog,
} from "./delete-class-dialog";

import {
  EditClassDialog,
} from "./edit-class-dialog";

export function ClassesPage() {
  const academicYears =
    useAcademicYears();

  const [
    selectedAcademicYearId,
    setSelectedAcademicYearId,
  ] = useState("");

  useEffect(() => {
    if (
      !selectedAcademicYearId &&
      academicYears.data?.length
    ) {
      const current =
        academicYears.data.find(
          (year) => year.is_current,
        );

      setSelectedAcademicYearId(
        current?.id ??
          academicYears.data[0].id,
      );
    }
  }, [
    academicYears.data,
    selectedAcademicYearId,
  ]);

  const {
    data: classes = [],
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useClasses(
    selectedAcademicYearId,
  );

  const [editing, setEditing] =
    useState<SchoolClass | null>(
      null,
    );

  const [deleting, setDeleting] =
    useState<SchoolClass | null>(
      null,
    );

    const selectedAcademicYear =
      academicYears.data?.find(
        (y) => y.id === selectedAcademicYearId,
      );

  return (
    <>
      <div className="space-y-6 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Classes
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                Manage classes for an
                academic year.
              </p>
            </div>

            <div className="w-full max-w-xs">
              <label className="mb-2 block text-sm font-medium">
                Academic Year
              </label>

              <Select
                value={
                  selectedAcademicYearId
                }
                onValueChange={
                  setSelectedAcademicYearId
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Academic Year" />
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
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={isFetching}
              onClick={() =>
                void refetch()
              }
            >
              <RefreshCw
                className={
                  isFetching
                    ? "size-4 animate-spin"
                    : "size-4"
                }
              />
            </Button>

            <CreateClassDialog
              academicYearId={
                selectedAcademicYearId
              }
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex min-h-72 items-center justify-center rounded-xl border">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : isError ? (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border p-8 text-center">
            <AlertCircle className="size-7 text-destructive" />

            <h3 className="mt-4 font-semibold">
              Unable to load classes
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Class data could not be loaded.
            </p>

            <Button
              variant="outline"
              className="mt-4"
              onClick={() =>
                void refetch()
              }
            >
              Try Again
            </Button>
          </div>
        ) : (
          <ClassesTable
            classes={classes}
            onEdit={setEditing}
            onDelete={setDeleting}
          />
        )}
      </div>

      <EditClassDialog
        schoolClass={editing}
        open={editing !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditing(null);
          }
        }}
      />

      <DeleteClassDialog
        schoolClass={deleting}
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleting(null);
          }
        }}
      />
    </>
  );
}