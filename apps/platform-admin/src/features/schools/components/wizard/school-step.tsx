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

import { CreateSchoolFormValues } from "../../schemas/create-school.schema";

interface Props {
  form: UseFormReturn<CreateSchoolFormValues>;
}

export function SchoolStep({
  form,
}: Props) {
  return (
    <Form {...form}>
      <div className="grid grid-cols-2 gap-5">
        <FormField
          control={form.control}
          name="school.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>School Name</FormLabel>

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
          name="school.code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>School Code</FormLabel>

              <FormControl>
                <Input
                  placeholder="ABC001"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="school.email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>

              <FormControl>
                <Input
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
          name="school.mobile_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile Number</FormLabel>

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
          name="school.website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>

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

        <div />

        <FormField
          control={form.control}
          name="school.address"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Address</FormLabel>

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
          name="school.description"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Description</FormLabel>

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