"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import type { SchoolClass } from "@/features/classes/types";

import {
  sectionSchema,
  type SectionFormData,
} from "../schemas/section.schema";

type Props = {
  classes: SchoolClass[];
  classesLoading?: boolean;
  defaultValues?: SectionFormData;
  isPending?: boolean;
  submitLabel: string;
  classLocked?: boolean;
  onSubmit: (
    values: SectionFormData,
  ) => void | Promise<void>;
};

const EMPTY_VALUES: SectionFormData = {
  class_id: "",
  name: "",
  code: "",
};

export function SectionForm({
  classes,
  classesLoading = false,
  defaultValues = EMPTY_VALUES,
  isPending = false,
  submitLabel,
  classLocked = false,
  onSubmit,
}: Props) {
  const form = useForm<SectionFormData>({
    resolver: zodResolver(sectionSchema),

    defaultValues: {
      class_id:
        defaultValues.class_id ?? "",
      name:
        defaultValues.name ?? "",
      code:
        defaultValues.code ?? "",
    },
  });

  const classDisabled =
    classLocked || isPending;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          onSubmit,
        )}
        className="space-y-6"
      >
        {/* Class */}
        <FormField
          control={form.control}
          name="class_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Class
              </FormLabel>

              <select
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
                disabled={classDisabled}
                className="flex h-9 w-full items-center rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-colors focus:border-ring focus:ring-3 focus:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">
                  {classesLoading
                    ? "Loading classes..."
                    : "Select class"}
                </option>

                {classes.map(
                  (schoolClass) => (
                    <option
                      key={
                        schoolClass.id
                      }
                      value={
                        schoolClass.id
                      }
                    >
                      {schoolClass.name}
                    </option>
                  ),
                )}
              </select>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Section fields */}
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Section Name
                </FormLabel>

                <Input
                  placeholder="A"
                  {...field}
                />

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Section Code
                </FormLabel>

                <Input
                  placeholder="A"
                  {...field}
                />

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Empty state */}
        {!classesLoading &&
          classes.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Create a class before adding
              sections.
            </p>
          )}

        {/* Submit */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={
              isPending ||
              classesLoading ||
              classes.length === 0
            }
          >
            {isPending && (
              <Loader2 className="size-4 animate-spin" />
            )}

            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}