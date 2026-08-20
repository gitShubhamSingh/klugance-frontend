"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useUpdateAcademicYear } from "../hooks/use-update-academic-year";
import type { AcademicYearFormData } from "../schemas/academic-year.schema";
import type { AcademicYear } from "../types";

import { AcademicYearForm } from "./academic-year-form";

type Props = {
  academicYear: AcademicYear | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditAcademicYearDialog({
  academicYear,
  open,
  onOpenChange,
}: Props) {
  const mutation =
    useUpdateAcademicYear();

  if (!academicYear) {
    return null;
  }

  async function handleSubmit(
    values: AcademicYearFormData,
  ) {
    if (!academicYear) {
      return;
    }

    await mutation.mutateAsync({
      id: academicYear.id,

      payload: {
        name: values.name,
        start_date: values.start_date,
        end_date: values.end_date,
      },
    });

    onOpenChange(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Edit Academic Year
          </DialogTitle>

          <DialogDescription>
            Update the academic session
            information.
          </DialogDescription>
        </DialogHeader>

        <AcademicYearForm
          key={academicYear.id}
          defaultValues={{
            name: academicYear.name,
            start_date:
              academicYear.start_date,
            end_date:
              academicYear.end_date,
            is_current:
              academicYear.is_current,
          }}
          showCurrent={false}
          submitLabel="Save Changes"
          isPending={mutation.isPending}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}