"use client";

import {
  useFormContext,
} from "react-hook-form";

import {
  useSchools,
} from "@/features/schools/hooks/use-schools";

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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type {
  CreateSchoolAdminFormValues,
} from "../../schemas";

export function CreateSchoolAdminForm() {
  const form =
    useFormContext<CreateSchoolAdminFormValues>();

  const {
    data: schools = [],
    isLoading: isLoadingSchools,
  } = useSchools();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
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
                  isLoadingSchools
                }
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        isLoadingSchools
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
                        key={
                          school.id
                        }
                        value={
                          school.id
                        }
                      >
                        {school.name} (
                        {school.code})
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
          name="role_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Role
              </FormLabel>

              <Select
                value={field.value}
                onValueChange={
                  field.onChange
                }
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  <SelectItem value="PRINCIPAL">
                    Principal
                  </SelectItem>

                  <SelectItem value="VICE_PRINCIPAL">
                    Vice Principal
                  </SelectItem>

                  <SelectItem value="SCHOOL_OWNER">
                    School Owner
                  </SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>

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
                  {...field}
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Email
              </FormLabel>

              <FormControl>
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="admin@school.com"
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
      </div>

      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Temporary Password
            </FormLabel>

            <FormControl>
              <Input
                type="password"
                autoComplete="new-password"
                placeholder="Minimum 8 characters"
                {...field}
              />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}