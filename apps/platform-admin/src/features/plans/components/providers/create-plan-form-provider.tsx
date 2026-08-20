"use client";

import {
  ReactNode,
} from "react";

import {
  useForm,
  UseFormReturn,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  createPlanSchema,
  CreatePlanFormValues,
} from "../../schemas";

interface Props {
  children: (
    form: UseFormReturn<CreatePlanFormValues>,
  ) => ReactNode;
}

export function CreatePlanFormProvider({
  children,
}: Props) {
  const form =
    useForm<CreatePlanFormValues>({
      resolver:
        zodResolver(createPlanSchema),

      defaultValues: {
        code: "",
        name: "",
        billing_cycle: "YEARLY",
        price: "",
        currency: "INR",
      },
    });

  return children(form);
}