"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useCreateAcademicYear } from "../hooks/use-create-academic-year";
import type { AcademicYearFormData } from "../schemas/academic-year.schema";

import { AcademicYearForm } from "./academic-year-form";

export function CreateAcademicYearDialog() {
  const [open, setOpen] = useState(false);

  const mutation =
    useCreateAcademicYear();

  async function handleSubmit(
    values: AcademicYearFormData,
  ) {
    await mutation.mutateAsync(values);

    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger
        render={
          <Button>
            <Plus className="size-4" />

            Add Academic Year
          </Button>
        }
      />

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Add Academic Year
          </DialogTitle>

          <DialogDescription>
            Create a new academic session for
            your school.
          </DialogDescription>
        </DialogHeader>

        <AcademicYearForm
          submitLabel="Create Academic Year"
          isPending={mutation.isPending}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}