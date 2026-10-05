"use client";

import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useDeleteClassSubject } from "../hooks/use-delete-class-subject";
import type { Subject } from "../types";

type Props = {
  subject: Subject | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classId: string;
};

export function DeleteSubjectDialog({
  subject,
  open,
  onOpenChange,
  classId,
}: Props) {
  const mutation = useDeleteClassSubject();

  if (!subject) {
    return null;
  }

  async function handleDelete() {
    if (!subject?.class_subject_id) {
      toast.error("Class subject is missing.");
      return;
    }
  
    if (!classId) {
      toast.error("Class is missing.");
      return;
    }
  
    try {
      await mutation.mutateAsync({
        classSubjectId: subject.class_subject_id,
        classId,
      });
  
      toast.success("Subject deleted successfully.");
  
      onOpenChange(false);
    } catch (error) {
      console.error(
        "Failed to delete subject:",
        error,
      );
  
      toast.error(
        "Failed to delete subject. Please try again.",
      );
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
          <DialogTitle>
            Delete Subject?
          </DialogTitle>

          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-medium text-foreground">
              {subject.name}
            </span>
            ?

            <br />

            <span className="mt-2 block">
              This action cannot be undone.
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
                Delete
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}