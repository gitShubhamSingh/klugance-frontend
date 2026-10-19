
"use client";

import { Loader2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useDeleteTeacher } from "../hooks/use-delete-teacher";
import type { Teacher } from "../types";

type Props = {
  teacher: Teacher | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteTeacherDialog({
  teacher,
  open,
  onOpenChange,
}: Props) {
  const mutation = useDeleteTeacher();

  if (!teacher) {
    return null;
  }

  const teacherName = [
    teacher.first_name,
    teacher.middle_name,
    teacher.last_name,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || "this teacher";

  async function handleDelete() {
    try {
      await mutation.mutateAsync(teacher.id);
      onOpenChange(false);
    } catch {
      // The mutation hook displays the error toast.
      // Keep the dialog open so the user can retry.
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (mutation.isPending) {
          return;
        }

        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete teacher?</DialogTitle>

          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-medium text-foreground">
              {teacherName}
            </span>
            ?

            <span className="mt-2 block">
              The teacher will be removed from the active
              teacher list. This operation uses a soft delete
              in the backend.
            </span>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={mutation.isPending}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            disabled={mutation.isPending}
            onClick={handleDelete}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 size-4" />
                Delete teacher
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
