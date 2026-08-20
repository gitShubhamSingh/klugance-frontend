"use client";

import type {
  ReactNode,
} from "react";

import {
  FormProvider,
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  createSchoolAdminSchema,
} from "../../schemas";

import type {
  CreateSchoolAdminFormValues,
} from "../../schemas";

interface CreateSchoolAdminFormProviderProps {
  children: ReactNode;
}

export function CreateSchoolAdminFormProvider({
  children,
}: CreateSchoolAdminFormProviderProps) {
  const form =
    useForm<CreateSchoolAdminFormValues>({
      resolver: zodResolver(
        createSchoolAdminSchema,
      ),

      defaultValues: {
        school_id: "",
        role_code: "PRINCIPAL",

        first_name: "",
        middle_name: "",
        last_name: "",

        email: "",
        mobile_number: "",
        password: "",
      },
    });

  return (
    <FormProvider {...form}>
      {children}
    </FormProvider>
  );
}