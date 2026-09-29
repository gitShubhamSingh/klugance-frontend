"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { useEffect } from "react";

import {
  useForm,
} from "react-hook-form";

import { Button } from "@/components/ui/button";

import {
  Checkbox,
} from "@/components/ui/checkbox";

import {
  Input,
} from "@/components/ui/input";

import {
  Label,
} from "@/components/ui/label";

import {
  Textarea,
} from "@/components/ui/textarea";

import {
  subjectSchema,
  type SubjectFormData,
} from "../schemas/subject.schema";

type Props = {
  defaultValues?: Partial<SubjectFormData>;

  submitLabel: string;

  isPending: boolean;

  onSubmit: (
    values: SubjectFormData,
  ) => Promise<void> | void;
};

export function SubjectForm({
  defaultValues,
  submitLabel,
  isPending,
  onSubmit,
}: Props) {
  const form =
    useForm<SubjectFormData>({
      resolver:
        zodResolver(subjectSchema),

      defaultValues: {
        name: "",
        code: "",
        description: "",
        is_mandatory: true,

        ...defaultValues,
      },
    });

  useEffect(() => {
    form.reset({
      name: "",
      code: "",
      description: "",
      is_mandatory: true,

      ...defaultValues,
    });
  }, [
    defaultValues,
    form,
  ]);

  return (
    <form
      className="space-y-5"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      {/* ============================================= */}
      {/* SUBJECT NAME */}
      {/* ============================================= */}

      <div className="space-y-2">
        <Label htmlFor="subject-name">
          Subject Name
        </Label>

        <Input
          id="subject-name"
          placeholder="e.g. Mathematics"
          disabled={isPending}
          {...form.register("name")}
        />

        {form.formState.errors.name && (
          <p className="text-sm text-destructive">
            {
              form.formState.errors.name
                .message
            }
          </p>
        )}
      </div>

      {/* ============================================= */}
      {/* SUBJECT CODE */}
      {/* ============================================= */}

      <div className="space-y-2">
        <Label htmlFor="subject-code">
          Subject Code
        </Label>

        <Input
          id="subject-code"
          placeholder="e.g. MATH-8"
          disabled={isPending}
          {...form.register("code")}
        />

        <p className="text-xs text-muted-foreground">
          Optional identifier for this subject.
        </p>

        {form.formState.errors.code && (
          <p className="text-sm text-destructive">
            {
              form.formState.errors.code
                .message
            }
          </p>
        )}
      </div>

      {/* ============================================= */}
      {/* DESCRIPTION */}
      {/* ============================================= */}

      <div className="space-y-2">
        <Label htmlFor="subject-description">
          Description
        </Label>

        <Textarea
          id="subject-description"
          placeholder="Add a brief description..."
          disabled={isPending}
          className="min-h-28 resize-none"
          {...form.register("description")}
        />

        {form.formState.errors.description && (
          <p className="text-sm text-destructive">
            {
              form.formState.errors
                .description.message
            }
          </p>
        )}
      </div>

      {/* ============================================= */}
      {/* MANDATORY */}
      {/* ============================================= */}

      <div className="flex items-start gap-3 rounded-xl border bg-muted/20 p-4">
        <Checkbox
          id="is-mandatory"
          checked={
            form.watch("is_mandatory")
          }
          disabled={isPending}
          onCheckedChange={(checked) => {
            form.setValue(
              "is_mandatory",
              checked === true,
            );
          }}
        />

        <div className="space-y-1">
          <Label
            htmlFor="is-mandatory"
            className="cursor-pointer"
          >
            Mandatory Subject
          </Label>

          <p className="text-sm text-muted-foreground">
            Students in this class are required
            to study this subject.
          </p>
        </div>
      </div>

      {/* ============================================= */}
      {/* ACTION */}
      {/* ============================================= */}

      <Button
        type="submit"
        className="w-full"
        disabled={isPending}
      >
        {isPending && (
          <Loader2 className="size-4 animate-spin" />
        )}

        {submitLabel}
      </Button>
    </form>
  );
}