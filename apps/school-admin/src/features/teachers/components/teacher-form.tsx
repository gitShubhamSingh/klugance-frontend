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
  teacherSchema,
  type TeacherFormData,
} from "../schemas/teacher.schema";

type Props = {
  defaultValues?: Partial<TeacherFormData>;

  isPending?: boolean;

  submitLabel?: string;

  onSubmit: (
    values: TeacherFormData,
  ) => void | Promise<void>;
};

const DEFAULT_VALUES: TeacherFormData = {
  first_name: "",
  middle_name: "",
  last_name: "",
  email: "",
  mobile_number: "",
  joining_date: "",
  employee_code: "",
  qualification: "",
  experience_years: 0,
  bio: "",
};

export function TeacherForm({
  defaultValues,
  isPending = false,
  submitLabel = "Create Teacher",
  onSubmit,
}: Props) {
  const form = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),

    defaultValues: {
      ...DEFAULT_VALUES,
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        {/* =========================================================
            Personal Information
        ========================================================= */}

        <section className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold">
              Personal Information
            </h3>

            <p className="text-sm text-muted-foreground">
              Basic information about the teacher.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {/* First Name */}

            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    First Name
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Rahul"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Middle Name */}

            <FormField
              control={form.control}
              name="middle_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Middle Name
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Kumar"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Last Name */}

            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Last Name
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Sharma"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Email */}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email
                  </FormLabel>

                  <FormControl>
                    <Input
                      type="email"
                      placeholder="rahul@school.com"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Mobile */}

            <FormField
              control={form.control}
              name="mobile_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Mobile Number
                  </FormLabel>

                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="+91 9876543210"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* =========================================================
            Employment Information
        ========================================================= */}

        <section className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold">
              Employment Information
            </h3>

            <p className="text-sm text-muted-foreground">
              Information used to manage the
              teacher's employment record.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Employee Code */}

            <FormField
              control={form.control}
              name="employee_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Employee Code
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="T-0001"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Joining Date */}

            <FormField
              control={form.control}
              name="joining_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Joining Date
                  </FormLabel>

                  <FormControl>
                    <Input
                      type="date"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Qualification */}

            <FormField
              control={form.control}
              name="qualification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Qualification
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="M.Sc Mathematics"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Experience */}

            <FormField
              control={form.control}
              name="experience_years"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Experience (Years)
                  </FormLabel>

                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={60}
                      step={1}
                      placeholder="5"
                      disabled={isPending}
                      value={field.value}
                      onChange={(event) => {
                        const value =
                          event.target.value;

                        field.onChange(
                          value === ""
                            ? 0
                            : Number(value),
                        );
                      }}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Bio */}

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Bio
                </FormLabel>

                <FormControl>
                  <Textarea
                    placeholder="Brief description about the teacher..."
                    className="min-h-24 resize-none"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        {/* =========================================================
            Submit
        ========================================================= */}

        <div className="flex justify-end gap-2 border-t pt-4">
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