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
  updatePlanSchema,
  UpdatePlanFormValues,
} from "../../schemas";

import { Plan } from "../../types";

interface Props {
  plan: Plan;

  children: (
    form:
      UseFormReturn<UpdatePlanFormValues>,
  ) => ReactNode;
}

export function UpdatePlanFormProvider({
  plan,
  children,
}: Props) {
  const form =
    useForm<UpdatePlanFormValues>({
      resolver:
        zodResolver(updatePlanSchema),

      defaultValues: {
        name: plan.name,

        billing_cycle:
          plan.billing_cycle,

        price: String(
          plan.price,
        ),

        currency:
          plan.currency,
      },
    });

  return children(form);
}