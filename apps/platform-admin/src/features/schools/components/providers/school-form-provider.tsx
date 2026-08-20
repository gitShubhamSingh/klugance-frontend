"use client";

import { ReactNode } from "react";

import {
  useForm,
  UseFormReturn,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  createSchoolSchema,
  CreateSchoolFormValues,
} from "../../schemas/create-school.schema";

interface Props {
  defaultValues?: Partial<CreateSchoolFormValues>;

  children: (
    form: UseFormReturn<CreateSchoolFormValues>
  ) => ReactNode;
}

export function SchoolFormProvider({
  defaultValues,
  children,
}: Props) {
  const form =
    useForm<CreateSchoolFormValues>({
      resolver: zodResolver(
        createSchoolSchema
      ),

      defaultValues: {
        school: {
          name: "",
          code: "",
          email: "",
          mobile_number: "",
          website: "",
          address: "",
          description: "",
        },

        owner: {
          email: "",
          mobile_number: "",
          password: "",
          first_name: "",
          middle_name: "",
          last_name: "",
        },

        principal: {
          email: "",
          mobile_number: "",
          password: "",
          first_name: "",
          middle_name: "",
          last_name: "",
        },

        ...defaultValues,
      },
    });

  return <>{children(form)}</>;
}