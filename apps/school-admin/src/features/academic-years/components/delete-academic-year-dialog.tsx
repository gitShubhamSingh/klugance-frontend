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

import { useDeleteAcademicYear } from "../hooks/use-delete-academic-year";
import type { AcademicYear } from "../types";

type Props = {
  academicYear: AcademicYear | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteAcademicYearDialog({
  academicYear,
  open,
  onOpenChange,
}: Props) {
  const mutation =
    useDeleteAcademicYear();

  if (!academicYear) {
    return null;
  }

  async function handleDelete() {
    if (!academicYear) {
      return;
    }

    await mutation.mutateAsync(
      academicYear.id,
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
            Delete Academic Year?
          </DialogTitle>

          <DialogDescription>
            You are about to delete{" "}
            <strong>
              {academicYear.name}
            </strong>
            . This academic year will no longer
            be available for normal operations.
          </DialogDescription>
        </DialogHeader>

        {academicYear.is_current && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            The current academic year cannot be
            deleted. Select another current
            academic year first.
          </div>
        )}

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
            disabled={
              mutation.isPending ||
              academicYear.is_current
            }
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