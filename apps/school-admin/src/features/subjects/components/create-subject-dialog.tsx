"use client";

import axios from "axios";

import {
  AlertCircle,
  Plus,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  Button,
} from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  useCreateSubjectForClass,
} from "../hooks/use-create-subject-for-class";

import type {
  SubjectFormData,
} from "../schemas/subject.schema";

import {
  SubjectForm,
} from "./subject-form";


type Props = {
  classId: string;
  className: string;
};


export function CreateSubjectDialog({
  classId,
  className,
}: Props) {
  /* ===================================================== */
  /* STATE */
  /* ===================================================== */

  const [open, setOpen] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);


  /* ===================================================== */
  /* MUTATION */
  /* ===================================================== */

  const mutation =
    useCreateSubjectForClass();


  /* ===================================================== */
  /* CREATE SUBJECT */
  /* ===================================================== */

  async function handleSubmit(
    values: SubjectFormData,
  ) {
    try {
      setErrorMessage(null);

      await mutation.mutateAsync({
        class_id: classId,

        name: values.name,

        code:
          values.code || undefined,

        description:
          values.description || undefined,

        is_mandatory:
          values.is_mandatory,
      });

      /* =============================================== */
      /* SUCCESS */
      /* =============================================== */

      setOpen(false);

    } catch (error) {
      /* =============================================== */
      /* API ERROR */
      /* =============================================== */

      if (axios.isAxiosError(error)) {
        const detail =
          error.response?.data?.detail;

        const message =
          error.response?.data?.message;

        setErrorMessage(
          detail ||
            message ||
            "Unable to create the subject. Please try again.",
        );

        return;
      }

      /* =============================================== */
      /* UNKNOWN ERROR */
      /* =============================================== */

      setErrorMessage(
        "Something unexpected happened. Please try again.",
      );
    }
  }


  /* ===================================================== */
  /* RENDER */
  /* ===================================================== */

  return (
    <>
      {/* ================================================= */}
      {/* CREATE SUBJECT DIALOG */}
      {/* ================================================= */}

      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <Button
          type="button"
          onClick={() => setOpen(true)}
        >
          <Plus className="size-4" />

          Add Subject
        </Button>

        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              Add Subject
            </DialogTitle>

            <DialogDescription>
              Create a subject and assign it to{" "}

              <strong>
                {className}
              </strong>

              .
            </DialogDescription>
          </DialogHeader>

          <SubjectForm
            submitLabel="Create Subject"
            isPending={mutation.isPending}
            onSubmit={handleSubmit}
          />
        </DialogContent>
      </Dialog>


      {/* ================================================= */}
      {/* ERROR DIALOG */}
      {/* ================================================= */}

      <Dialog
        open={Boolean(errorMessage)}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setErrorMessage(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            {/* ERROR ICON */}

            <div
              className="
                flex size-12 items-center justify-center
                rounded-2xl
                bg-destructive/10
              "
            >
              <AlertCircle
                className="
                  size-6 text-destructive
                "
              />
            </div>


            <DialogTitle className="mt-4">
              Unable to Create Subject
            </DialogTitle>


            <DialogDescription className="mt-2">
              {errorMessage}
            </DialogDescription>
          </DialogHeader>


          <div className="mt-2 flex justify-end">
            <Button
              type="button"
              onClick={() => {
                setErrorMessage(null);
              }}
            >
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}