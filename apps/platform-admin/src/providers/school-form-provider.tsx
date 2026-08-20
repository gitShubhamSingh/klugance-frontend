"use client";

import { ReactNode } from "react";

import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createSchoolSchema,
  CreateSchoolFormValues,
} from "../features/schools/schemas/create-school.schema";

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
  const form = useForm<CreateSchoolFormValues>({
    resolver: zodResolver(createSchoolSchema),

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
        first_name: "",
        middle_name: "",
        last_name: "",
        email: "",
        mobile_number: "",
        password: "",
      },

      principal: {
        first_name: "",
        middle_name: "",
        last_name: "",
        email: "",
        mobile_number: "",
        password: "",
      },

      ...defaultValues,
    },
  });

  return children(form);
}