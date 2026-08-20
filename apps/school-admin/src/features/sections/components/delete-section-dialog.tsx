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

import { useDeleteSection } from "../hooks/use-delete-section";
import type { SchoolSection } from "../types";

type Props = {
  section: SchoolSection | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteSectionDialog({
  section,
  open,
  onOpenChange,
}: Props) {
  const mutation = useDeleteSection();

  if (!section) {
    return null;
  }

  async function handleDelete() {
    if (!section) {
      return;
    }

    await mutation.mutateAsync(
      section.id,
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
            Delete Section?
          </DialogTitle>

          <DialogDescription>
            You are about to delete{" "}
            <strong>
              {section.name}
            </strong>
            . It will no longer be
            available for normal academic
            operations.
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