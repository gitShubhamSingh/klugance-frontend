"use client";

import {
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

import { Input } from "@/components/ui/input";

import {
  UpdatePlanFormValues,
} from "../../schemas";

interface Props {
  form:
    UseFormReturn<UpdatePlanFormValues>;
}

export function UpdatePlanForm({
  form,
}: Props) {
  return (
    <Form {...form}>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Plan Name
              </FormLabel>

              <FormControl>
                <Input
                  placeholder="Plan name"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="billing_cycle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Billing Cycle
              </FormLabel>

              <FormControl>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  {...field}
                >
                  <option value="MONTHLY">
                    Monthly
                  </option>

                  <option value="YEARLY">
                    Yearly
                  </option>
                </select>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Price
              </FormLabel>

              <FormControl>
                <Input
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  {...field}
                  onChange={(event) => {
                    const value =
                      event.target.value;

                    if (
                      /^\d*(\.\d{0,2})?$/.test(
                        value,
                      )
                    ) {
                      field.onChange(
                        value,
                      );
                    }
                  }}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Currency
              </FormLabel>

              <FormControl>
                <Input
                  maxLength={3}
                  placeholder="INR"
                  {...field}
                  onChange={(event) =>
                    field.onChange(
                      event.target.value.toUpperCase(),
                    )
                  }
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