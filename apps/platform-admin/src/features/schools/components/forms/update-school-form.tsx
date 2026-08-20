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
  UpdateSchoolFormValues,
} from "../../schemas";

interface Props {
  form: UseFormReturn<UpdateSchoolFormValues>;
}

export function UpdateSchoolForm({
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
                School Name
              </FormLabel>

              <FormControl>
                <Input
                  placeholder="ABC Public School"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

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
                  placeholder="info@school.com"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

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
                  placeholder="9876543210"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Website
              </FormLabel>

              <FormControl>
                <Input
                  placeholder="https://school.com"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>
                Address
              </FormLabel>

              <FormControl>
                <Textarea
                  rows={3}
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>
                Description
              </FormLabel>

              <FormControl>
                <Textarea
                  rows={4}
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