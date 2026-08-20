"use client";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useDeleteClass } from "../hooks/use-delete-class";
import type { SchoolClass } from "../types";

type Props = {
  schoolClass: SchoolClass | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteClassDialog({
  schoolClass,
  open,
  onOpenChange,
}: Props) {
  const mutation = useDeleteClass();

  if (!schoolClass) {
    return null;
  }

  async function handleDelete() {
    if (!schoolClass) {
      return;
    }

    await mutation.mutateAsync(
      schoolClass.id,
    );

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
            Delete Class?
          </DialogTitle>

          <DialogDescription>
            You are about to delete{" "}
            <strong>
              {schoolClass.name}
            </strong>
            . It will no longer be available
            for normal academic operations.
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

            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}