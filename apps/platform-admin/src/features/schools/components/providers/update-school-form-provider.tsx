"use client";

import { ReactNode } from "react";

import {
  useForm,
  UseFormReturn,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  updateSchoolSchema,
  UpdateSchoolFormValues,
} from "../../schemas";

import { School } from "../../types";

interface Props {
  school: School;

  children: (
    form: UseFormReturn<UpdateSchoolFormValues>,
  ) => ReactNode;
}

export function UpdateSchoolFormProvider({
  school,
  children,
}: Props) {
  const form =
    useForm<UpdateSchoolFormValues>({
      resolver:
        zodResolver(updateSchoolSchema),

      defaultValues: {
        name: school.name ?? "",
        email: school.email ?? "",
        mobile_number:
          school.mobile_number ?? "",
        website:
          school.website ?? "",
        address:
          school.address ?? "",
        description:
          school.description ?? "",
      },
    });

  return children(form);
}