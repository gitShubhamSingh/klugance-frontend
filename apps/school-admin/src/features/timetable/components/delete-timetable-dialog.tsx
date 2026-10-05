"use client";

import {
  AlertTriangle,
  Loader2,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useDeleteTimetable } from "../hooks/use-delete-timetable";

type Props = {
  open: boolean;

  onOpenChange: (
    open: boolean,
  ) => void;

  timetableId: string;

  classId: string;

  sectionId: string;

  subjectName?: string;

  teacherName?: string;

  day?: string;

  startTime?: string;

  endTime?: string;
};

export function DeleteTimetableDialog({
  open,
  onOpenChange,
  timetableId,
  classId,
  sectionId,
  subjectName,
  teacherName,
  day,
  startTime,
  endTime,
}: Props) {
  const mutation =
    useDeleteTimetable();

  async function handleDelete() {
    if (!timetableId) {
      return;
    }

    try {
      await mutation.mutateAsync({
        timetableId,
        classId,
        sectionId,
      });

      onOpenChange(false);
    } catch (error) {
      console.error(
        "Failed to delete timetable entry:",
        error,
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
          <DialogTitle className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="size-4 text-destructive" />
            </div>

            Delete Timetable Entry?
          </DialogTitle>

          <DialogDescription>
            Are you sure you want to remove this timetable
            entry? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-xl border bg-muted/30 p-4">
          {subjectName && (
            <div>
              <p className="text-xs text-muted-foreground">
                Subject
              </p>

              <p className="mt-1 text-sm font-semibold">
                {subjectName}
              </p>
            </div>
          )}

          {teacherName && (
            <div className="mt-3">
              <p className="text-xs text-muted-foreground">
                Teacher
              </p>

              <p className="mt-1 text-sm font-medium">
                {teacherName}
              </p>
            </div>
          )}

          {(day || startTime || endTime) && (
            <div className="mt-3">
              <p className="text-xs text-muted-foreground">
                Schedule
              </p>

              <p className="mt-1 text-sm font-medium">
                {day}

                {startTime && endTime
                  ? ` · ${startTime} – ${endTime}`
                  : null}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={mutation.isPending}
            onClick={() =>
              onOpenChange(false)
            }
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            disabled={
              mutation.isPending ||
              !timetableId
            }
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