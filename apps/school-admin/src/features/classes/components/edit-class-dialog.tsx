"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useUpdateClass } from "../hooks/use-update-class";
import type { ClassFormData } from "../schemas/class.schema";
import type { SchoolClass } from "../types";

import { ClassForm } from "./class-form";

type Props = {
  schoolClass: SchoolClass | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditClassDialog({
  schoolClass,
  open,
  onOpenChange,
}: Props) {
  const mutation = useUpdateClass();

  if (!schoolClass) {
    return null;
  }

  async function handleSubmit(
    values: ClassFormData,
  ) {
    if (!schoolClass) {
      return;
    }

    await mutation.mutateAsync({
      id: schoolClass.id,

      payload: {
        name: values.name,
        code: values.code,
        description:
          values.description || null,
        display_order:
          values.display_order,
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
            Edit Class
          </DialogTitle>

          <DialogDescription>
            Update class information.
          </DialogDescription>
        </DialogHeader>

        <ClassForm
          key={schoolClass.id}
          defaultValues={{
            name: schoolClass.name,
            code: schoolClass.code,
            description:
              schoolClass.description ?? "",
            display_order:
              schoolClass.display_order,
          }}
          submitLabel="Save Changes"
          isPending={mutation.isPending}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}