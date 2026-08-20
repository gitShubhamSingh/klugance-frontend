"use client";

import { UseFormReturn } from "react-hook-form";

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
  CreateProductFormValues,
} from "../../schemas";

interface Props {
  form: UseFormReturn<CreateProductFormValues>;
}

export function ProductForm({
  form,
}: Props) {
  return (
    <Form {...form}>
      <div className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Product Code
                </FormLabel>

                <FormControl>
                  <Input
                    placeholder="KL-SOS-V1"
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Product Name
                </FormLabel>

                <FormControl>
                  <Input
                    placeholder="Klugance School Operating System"
                    autoComplete="off"
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
                  rows={5}
                  placeholder="Describe the product and its purpose..."
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