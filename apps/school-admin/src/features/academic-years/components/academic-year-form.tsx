"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  academicYearSchema,
  type AcademicYearFormData,
} from "../schemas/academic-year.schema";

type Props = {
  defaultValues?: AcademicYearFormData;
  isPending?: boolean;
  showCurrent?: boolean;
  submitLabel: string;
  onSubmit: (
    values: AcademicYearFormData,
  ) => void | Promise<void>;
};

const EMPTY_VALUES: AcademicYearFormData = {
  name: "",
  start_date: "",
  end_date: "",
  is_current: false,
};

export function AcademicYearForm({
  defaultValues = EMPTY_VALUES,
  isPending = false,
  showCurrent = true,
  submitLabel,
  onSubmit,
}: Props) {
  const form = useForm<AcademicYearFormData>({
    resolver: zodResolver(academicYearSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Academic Year Name
              </FormLabel>

              <FormControl>
                <Input
                  placeholder="2026-2027"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Start Date
                </FormLabel>

                <FormControl>
                  <Input
                    type="date"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  End Date
                </FormLabel>

                <FormControl>
                  <Input
                    type="date"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {showCurrent && (
          <FormField
            control={form.control}
            name="is_current"
            render={({ field }) => (
              <FormItem className="flex items-start gap-3 rounded-lg border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(value) =>
                      field.onChange(
                        Boolean(value),
                      )
                    }
                  />
                </FormControl>

                <div className="space-y-1">
                  <FormLabel>
                    Set as current academic year
                  </FormLabel>

                  <p className="text-sm text-muted-foreground">
                    The school dashboard and
                    academic operations will use
                    this academic year as the
                    current session.
                  </p>

                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        )}

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