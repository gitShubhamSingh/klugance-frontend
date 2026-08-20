"use client";

import type {
  UseFormReturn,
} from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Input,
} from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  useSchools,
} from "@/features/schools/hooks";

import {
  usePlans,
} from "@/features/plans/hooks";

import type {
  CreateSubscriptionFormValues,
} from "../../schemas";

interface Props {
  form: UseFormReturn<CreateSubscriptionFormValues>;
}

export function CreateSubscriptionForm({
  form,
}: Props) {
  const {
    data: schools = [],
    isLoading: schoolsLoading,
  } = useSchools();

  const {
    data: plans = [],
    isLoading: plansLoading,
  } = usePlans();

  return (
    <Form {...form}>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="school_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                School
              </FormLabel>

              <Select
                value={field.value}
                onValueChange={
                  field.onChange
                }
                disabled={
                  schoolsLoading
                }
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        schoolsLoading
                          ? "Loading schools..."
                          : "Select school"
                      }
                    />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {schools.map(
                    (school) => (
                      <SelectItem
                        key={school.id}
                        value={school.id}
                      >
                        {school.name}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="plan_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Plan
              </FormLabel>

              <Select
                value={field.value}
                onValueChange={
                  field.onChange
                }
                disabled={
                  plansLoading
                }
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        plansLoading
                          ? "Loading plans..."
                          : "Select plan"
                      }
                    />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {plans.map(
                    (plan) => (
                      <SelectItem
                        key={plan.id}
                        value={plan.id}
                      >
                        {plan.name}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

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
    </Form>
  );
}