"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import type { TeacherFormData } from "../schemas/teacher.schema";

import {
  useCreateTeacher,
} from "../hooks/use-create-teacher";

import { TeacherForm } from "./teacher-form";

export function CreateTeacherDialog() {
  const [open, setOpen] =
    useState(false);

  const mutation =
    useCreateTeacher();

  async function handleSubmit(
    values: TeacherFormData,
  ) {
    try {
      await mutation.mutateAsync(
        values,
      );

      setOpen(false);
    } catch {
      // Mutation error is handled by
      // the mutation/API layer.
      // Keep dialog open so the user
      // can correct/retry the form.
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (
          mutation.isPending &&
          !nextOpen
        ) {
          return;
        }

        setOpen(nextOpen);
      }}
    >
      <DialogTrigger
        render={
          <Button type="button">
            <Plus className="size-4" />
            Add Teacher
          </Button>
        }
      />

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Add Teacher
          </DialogTitle>

          <DialogDescription>
            Add a teacher to your school.
            The teacher's school association
            is determined by your authenticated
            school account.
          </DialogDescription>
        </DialogHeader>

        <TeacherForm
          submitLabel="Create Teacher"
          isPending={
            mutation.isPending
          }
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}