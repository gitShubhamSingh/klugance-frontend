"use client";

import {
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { useAcademicYears } from "../hooks/use-academic-years";
import type { AcademicYear } from "../types";

import { AcademicYearsTable } from "./academic-years-table";
import { CreateAcademicYearDialog } from "./create-academic-year-dialog";
import { DeleteAcademicYearDialog } from "./delete-academic-year-dialog";
import { EditAcademicYearDialog } from "./edit-academic-year-dialog";


import { useSetCurrentAcademicYear } from "../hooks/use-set-current-academic-year";


export function AcademicYearsPage() {
  const {
    data: academicYears = [],
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useAcademicYears();

  const [editing, setEditing] =
    useState<AcademicYear | null>(
      null,
    );

  const [deleting, setDeleting] =
    useState<AcademicYear | null>(
      null,
    );

    const setCurrent =
        useSetCurrentAcademicYear();

  return (
    <>
      <div className="space-y-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Academic Years
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage academic sessions for
              your school.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              aria-label="Refresh academic years"
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

            <CreateAcademicYearDialog />
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
              Unable to load academic years
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              The academic year data could not
              be loaded.
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
            <AcademicYearsTable
                academicYears={
                academicYears
                }
                onEdit={setEditing}
                onDelete={setDeleting}
                onSetCurrent={(
                academicYear,
                ) => {
                setCurrent.mutate(
                    academicYear.id,
                );
                }}
                settingCurrentId={
                setCurrent.isPending
                    ? setCurrent.variables
                    : undefined
                }
            />
        )}
      </div>

      <EditAcademicYearDialog
        academicYear={editing}
        open={editing !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditing(null);
          }
        }}
      />

      <DeleteAcademicYearDialog
        academicYear={deleting}
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