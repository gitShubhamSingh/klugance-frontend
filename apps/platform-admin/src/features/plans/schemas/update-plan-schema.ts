import { z } from "zod";

export const updatePlanSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Plan name is required"),

  billing_cycle: z.enum([
    "MONTHLY",
    "YEARLY",
  ]),

  price: z
    .string()
    .trim()
    .min(1, "Price is required")
    .refine(
      (value) => {
        const amount = Number(value);

        return (
          Number.isFinite(amount) &&
          amount >= 0
        );
      },
      {
        message: "Enter a valid price.",
      },
    )
    .refine(
      (value) =>
        /^\d+(\.\d{1,2})?$/.test(value),
      {
        message:
          "Price can have maximum 2 decimal places.",
      },
    ),

  currency: z
    .string()
    .trim()
    .length(
      3,
      "Currency must be 3 characters",
    ),
});

export type UpdatePlanFormValues =
  z.infer<typeof updatePlanSchema>;