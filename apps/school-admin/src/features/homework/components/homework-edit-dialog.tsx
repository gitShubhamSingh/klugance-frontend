"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";

import type { Homework } from "../types";

type Props = {
  homework: Homework | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (homework: Homework) => void;
};

export function HomeworkEditDialog({
  homework,
  open,
  onOpenChange,
  onSave,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (!homework) {
      return;
    }

    setTitle(homework.title);
    setDescription(homework.description);
    setDueDate(homework.due_date);
  }, [homework]);

  if (!homework) {
    return null;
  }

  function handleSave() {
    const updatedHomework: Homework = {
      ...homework,

      title: title.trim(),
      description: description.trim(),
      due_date: dueDate,
    };

    onSave(updatedHomework);
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
            Edit Homework
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="homework-title"
              className="text-sm font-medium"
            >
              Homework Title
            </label>

            <Input
              id="homework-title"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="homework-description"
              className="text-sm font-medium"
            >
              Description
            </label>

            <Textarea
              id="homework-description"
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value,
                )
              }
              rows={5}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="homework-due-date"
              className="text-sm font-medium"
            >
              Due Date
            </label>

            <Input
              id="homework-due-date"
              type="date"
              value={dueDate}
              onChange={(event) =>
                setDueDate(event.target.value)
              }
            />
          </div>

          <div className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
            Assigned by{" "}
            <span className="font-medium text-foreground">
              {homework.teacher_name}
            </span>{" "}
            for{" "}
            <span className="font-medium text-foreground">
              {homework.class_name} ·{" "}
              {homework.section_name}
            </span>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              onOpenChange(false)
            }
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={
              !title.trim() ||
              !description.trim() ||
              !dueDate
            }
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}