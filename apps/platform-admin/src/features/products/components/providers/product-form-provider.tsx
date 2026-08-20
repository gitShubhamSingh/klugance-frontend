"use client";

import { ReactNode } from "react";

import {
  useForm,
  UseFormReturn,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  createProductSchema,
  CreateProductFormValues,
} from "../../schemas";

interface Props {
  defaultValues?: Partial<CreateProductFormValues>;

  children: (
    form: UseFormReturn<CreateProductFormValues>,
  ) => ReactNode;
}

export function ProductFormProvider({
  defaultValues,
  children,
}: Props) {
  const form =
    useForm<CreateProductFormValues>({
      resolver: zodResolver(
        createProductSchema,
      ),

      defaultValues: {
        code: "",
        name: "",
        description: "",
        ...defaultValues,
      },
    });

  return children(form);
}