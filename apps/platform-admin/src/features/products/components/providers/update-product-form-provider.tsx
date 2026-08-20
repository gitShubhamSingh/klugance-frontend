"use client";

import { ReactNode } from "react";

import {
  useForm,
  UseFormReturn,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  updateProductSchema,
  UpdateProductFormValues,
} from "../../schemas";

interface Props {
  defaultValues: UpdateProductFormValues;

  children: (
    form: UseFormReturn<UpdateProductFormValues>,
  ) => ReactNode;
}

export function UpdateProductFormProvider({
  defaultValues,
  children,
}: Props) {
  const form =
    useForm<UpdateProductFormValues>({
      resolver: zodResolver(
        updateProductSchema,
      ),

      defaultValues,
    });

  return children(form);
}