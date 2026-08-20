"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { SchoolClass } from "@/features/classes/types";

import type { SectionFormData } from "../schemas/section.schema";
import { useUpdateSection } from "../hooks/use-update-section";
import type { SchoolSection } from "../types";

import { SectionForm } from "./section-form";

type Props = {
  section: SchoolSection | null;
  classes: SchoolClass[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditSectionDialog({
  section,
  classes,
  open,
  onOpenChange,
}: Props) {
  const mutation = useUpdateSection();

  if (!section) {
    return null;
  }

  async function handleSubmit(
    values: SectionFormData,
  ) {
    await mutation.mutateAsync({
      id: section.id,
      payload: {
        name: values.name,
        code: values.code,
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
            Edit Section
          </DialogTitle>

          <DialogDescription>
            Update section information.
            The assigned class cannot be
            changed here.
          </DialogDescription>
        </DialogHeader>

        <SectionForm
          key={section.id}
          classes={classes}
          defaultValues={{
            class_id: section.class_id,
            name: section.name,
            code: section.code,
          }}
          classLocked
          submitLabel="Save Changes"
          isPending={mutation.isPending}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}