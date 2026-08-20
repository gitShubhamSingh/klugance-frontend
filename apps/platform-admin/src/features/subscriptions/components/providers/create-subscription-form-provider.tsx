"use client";

import type {
  ReactNode,
} from "react";

import {
  useForm,
  type UseFormReturn,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  createSubscriptionSchema,
  type CreateSubscriptionFormValues,
} from "../../schemas";

interface Props {
  children: (
    form: UseFormReturn<CreateSubscriptionFormValues>,
  ) => ReactNode;
}

export function CreateSubscriptionFormProvider({
  children,
}: Props) {
  const form =
    useForm<CreateSubscriptionFormValues>({
      resolver: zodResolver(
        createSubscriptionSchema,
      ),

      defaultValues: {
        school_id: "",
        plan_id: "",
        start_date: "",
        end_date: "",
      },
    });

  return children(form);
}