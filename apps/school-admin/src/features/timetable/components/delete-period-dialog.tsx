
"use client";

import { Loader2, Trash2, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useDeletePeriod } from "../hooks/use-delete-period";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    periodId: string;
    periodName: string;
    startTime: string;
    endTime: string;
};

export function DeletePeriodDialog({
  open,
  onOpenChange,
  periodId,
  periodName,
  startTime,
  endTime
}: Props) {
  const mutation = useDeletePeriod();

  async function handleDelete() {
    if (!periodId) return;

    try {
      await mutation.mutateAsync(periodId);
      onOpenChange(false);
    } catch (error) {
      // The mutation displays the error notification.
      console.error("Period deletion failed:", error);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!mutation.isPending) {
          onOpenChange(nextOpen);
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-full bg-destructive/10">
              <Trash2 className="size-4 text-destructive" />
            </span>

            Delete Period?
          </DialogTitle>

        <DialogDescription>
        Are you sure you want to delete this period?
        </DialogDescription>

        <div className="rounded-lg border bg-muted/40 p-3">
        <p className="font-medium">{periodName}</p>

        <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 shrink-0" />
            <span>
            {startTime} – {endTime}
            </span>
        </div>
        </div>

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
            disabled={mutation.isPending || !periodId}
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
                Delete Period
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
