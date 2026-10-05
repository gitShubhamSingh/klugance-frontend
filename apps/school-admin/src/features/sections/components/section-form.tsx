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

import {
  sectionFormSchema,
  type SectionFormData,
} from "../schemas/section.schema";

type Props = {
  defaultValues?: Partial<SectionFormData>;

  isPending?: boolean;

  submitLabel: string;

  onSubmit: (
    values: SectionFormData,
  ) => void | Promise<void>;
};

const EMPTY_VALUES: SectionFormData = {
  name: "",
};

export function SectionForm({
  defaultValues = EMPTY_VALUES,
  isPending = false,
  submitLabel,
  onSubmit,
}: Props) {
  const form = useForm<SectionFormData>({
    resolver: zodResolver(sectionFormSchema),

    defaultValues: {
      name: defaultValues.name ?? "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          onSubmit,
        )}
        className="space-y-6"
      >
        {/* ============================================= */}
        {/* SECTION FIELDS */}
        {/* ============================================= */}

        <div className="grid gap-4 sm:grid-cols-1">

          {/* Section Name */}

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
                  disabled={isPending}
                  {...field}
                />

                <FormMessage />
              </FormItem>
            )}
          />

        </div>

        {/* ============================================= */}
        {/* SUBMIT */}
        {/* ============================================= */}

        <div className="flex justify-end">

          <Button
            type="submit"
            disabled={isPending}
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