"use client";

import {
  Loader2,
} from "lucide-react";

import {
  Button,
} from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  useDeleteClassSubject,
} from "../hooks/use-delete-class-subject";

import type {
  ClassSubject,
} from "../types/class-subject";

type Props = {
  classSubject:
    | ClassSubject
    | null;

  open: boolean;

  onOpenChange: (
    open: boolean,
  ) => void;
};

export function DeleteSubjectDialog({
  classSubject,
  open,
  onOpenChange,
}: Props) {
  const mutation =
    useDeleteClassSubject();

  if (!classSubject) {
    return null;
  }

  async function handleDelete() {
    await mutation.mutateAsync({
      classSubjectId:
        classSubject.id,

      classId:
        classSubject.class_id,
    });

    onOpenChange(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Remove Subject?
          </DialogTitle>

          <DialogDescription>
            You are about to remove{" "}
            <strong>
              {classSubject.subject?.name ??
                "this subject"}
            </strong>{" "}
            from this class.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() =>
              onOpenChange(false)
            }
            disabled={mutation.isPending}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={mutation.isPending}
          >
            {mutation.isPending && (
              <Loader2 className="size-4 animate-spin" />
            )}

            Remove Subject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}