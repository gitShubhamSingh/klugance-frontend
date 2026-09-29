"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  useUpdateSubject,
} from "../hooks/use-update-subject";

import type {
  Subject,
} from "../types";

import type {
  SubjectFormData,
} from "../schemas/subject.schema";

import {
  SubjectForm,
} from "./subject-form";

type Props = {
  subject: Subject | null;

  classId: string;

  open: boolean;

  onOpenChange: (
    open: boolean,
  ) => void;
};

export function EditSubjectDialog({
  subject,
  classId,
  open,
  onOpenChange,
}: Props) {
  const mutation =
    useUpdateSubject();

  if (!subject) {
    return null;
  }

  async function handleSubmit(
    values: SubjectFormData,
  ) {
    await mutation.mutateAsync({
      subjectId: subject.id,

      classId,

      payload: {
        name: values.name,

        code:
          values.code || undefined,

        description:
          values.description || undefined,
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
            Edit Subject
          </DialogTitle>

          <DialogDescription>
            Update the academic subject
            information.
          </DialogDescription>
        </DialogHeader>

        <SubjectForm
          key={subject.id}
          defaultValues={{
            name: subject.name,

            code:
              subject.code ?? "",

            description:
              subject.description ?? "",
          }}
          submitLabel="Save Changes"
          isPending={mutation.isPending}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}