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

import { CreateSchoolFormValues } from "../../schemas/create-school.schema";

interface Props {
  form: UseFormReturn<CreateSchoolFormValues>;
}

export function OwnerStep({
  form,
}: Props) {
  return (
    <Form {...form}>
      <div className="grid grid-cols-2 gap-5">

        <FormField
          control={form.control}
          name="owner.first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>

              <FormControl>
                <Input
                  placeholder="John"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="owner.middle_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Middle Name</FormLabel>

              <FormControl>
                <Input
                  placeholder="Andrew"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="owner.last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>

              <FormControl>
                <Input
                  placeholder="Doe"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="owner.email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>

              <FormControl>
                <Input
                  type="email"
                  placeholder="owner@school.com"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="owner.mobile_number"
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
          name="owner.password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>

              <FormControl>
                <Input
                  type="password"
                  placeholder="********"
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