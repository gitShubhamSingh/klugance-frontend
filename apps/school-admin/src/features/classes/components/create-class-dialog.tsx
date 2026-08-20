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

import { useCreateClass } from "../hooks/use-create-class";
import type { ClassFormData } from "../schemas/class.schema";

import { ClassForm } from "./class-form";

type Props = {
  academicYearId: string;
};

export function CreateClassDialog({
  academicYearId,
}: Props) {
  const [open, setOpen] = useState(false);

  const mutation = useCreateClass();

  async function handleSubmit(
    values: ClassFormData,
  ) {
    await mutation.mutateAsync({
      academic_year_id: academicYearId,
      name: values.name,
      code: values.code,
      description:
        values.description || null,
    });

    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger
        render={
          <Button
            disabled={!academicYearId}
          >
            <Plus className="size-4" />

            Add Class
          </Button>
        }
      />

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Add Class
          </DialogTitle>

          <DialogDescription>
            Create a class for the selected academic year.
          </DialogDescription>
        </DialogHeader>

        <ClassForm
          submitLabel="Create Class"
          isPending={mutation.isPending}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}