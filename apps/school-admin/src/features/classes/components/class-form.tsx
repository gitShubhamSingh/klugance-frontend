"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  classSchema,
  type ClassFormData,
} from "../schemas/class.schema";

type Props = {
  defaultValues?: ClassFormData;
  isPending?: boolean;
  submitLabel: string;
  onSubmit: (
    values: ClassFormData,
  ) => void | Promise<void>;
};

const EMPTY_VALUES: ClassFormData = {
  name: "",
  code: "",
  description: "",
};

export function ClassForm({
  defaultValues = EMPTY_VALUES,
  isPending = false,
  submitLabel,
  onSubmit,
}: Props) {
  const form = useForm<ClassFormData>({
    resolver: zodResolver(classSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Class Name
                </FormLabel>

                <FormControl>
                  <Input
                    placeholder="Grade 1"
                    {...field}
                  />
                </FormControl>

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
                  Class Code
                </FormLabel>

                <FormControl>
                  <Input
                    placeholder="GRADE_1"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Description
              </FormLabel>

              <FormControl>
                <Textarea
                  placeholder="Optional description for this class"
                  rows={4}
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

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