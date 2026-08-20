"use client";

import {
  useFormContext,
} from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Input,
} from "@/components/ui/input";

import type {
  UpdateSchoolAdminFormValues,
} from "../../schemas";

export function EditSchoolAdminForm() {
  const form =
    useFormContext<UpdateSchoolAdminFormValues>();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
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
                  placeholder="First name"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

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
                  placeholder="Optional"
                  value={
                    field.value ?? ""
                  }
                  onChange={
                    field.onChange
                  }
                  onBlur={
                    field.onBlur
                  }
                  name={
                    field.name
                  }
                  ref={
                    field.ref
                  }
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

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
                  placeholder="Last name"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
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
                  autoComplete="tel"
                  placeholder="Mobile number"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="profile_picture"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Profile Picture URL
              </FormLabel>

              <FormControl>
                <Input
                  type="url"
                  placeholder="https://..."
                  value={
                    field.value ?? ""
                  }
                  onChange={
                    field.onChange
                  }
                  onBlur={
                    field.onBlur
                  }
                  name={
                    field.name
                  }
                  ref={
                    field.ref
                  }
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}