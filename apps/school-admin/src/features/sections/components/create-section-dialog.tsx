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
} from "@/components/ui/dialog";

import { useCreateSection } from "../hooks/use-create-section";

import type {
  SectionFormData,
} from "../schemas/section.schema";

import { SectionForm } from "./section-form";

type Props = {
  classId: string;

  className: string;
};

export function CreateSectionDialog({
  classId,
  className,
}: Props) {
  const [open, setOpen] = useState(false);

  const mutation = useCreateSection();

  async function handleSubmit(
    values: SectionFormData,
  ) {
    await mutation.mutateAsync({
      class_id: classId,

      name: values.name,

      code: values.code,
    });

    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <Button
        type="button"
        onClick={() => setOpen(true)}
      >
        <Plus className="size-4" />

        Add Section
      </Button>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Add Section
          </DialogTitle>

          <DialogDescription>
            Create a section for{" "}
            <strong>
              {className}
            </strong>
            .
          </DialogDescription>
        </DialogHeader>

        <SectionForm
          submitLabel="Create Section"
          isPending={mutation.isPending}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}