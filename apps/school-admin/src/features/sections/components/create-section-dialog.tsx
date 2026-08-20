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

import type { SchoolClass } from "@/features/classes/types";

import { useCreateSection } from "../hooks/use-create-section";
import type { SectionFormData } from "../schemas/section.schema";

import { SectionForm } from "./section-form";

type Props = {
  classes: SchoolClass[];
  classesLoading?: boolean;
};

export function CreateSectionDialog({
  classes,
  classesLoading = false,
}: Props) {
  const [open, setOpen] = useState(false);

  const mutation = useCreateSection();

  async function handleSubmit(
    values: SectionFormData,
  ) {
    await mutation.mutateAsync({
      class_id: values.class_id,
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
      <DialogTrigger
        render={
          <Button type="button">
            <Plus className="size-4" />
            Add Section
          </Button>
        }
      />

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Add Section
          </DialogTitle>

          <DialogDescription>
            Create a section and assign it
            to a class.
          </DialogDescription>
        </DialogHeader>

        <SectionForm
          classes={classes}
          classesLoading={classesLoading}
          submitLabel="Create Section"
          isPending={mutation.isPending}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}