import { z } from "zod";

export const createSubscriptionSchema = z
  .object({
    school_id: z
      .string()
      .min(1, "School is required."),

    plan_id: z
      .string()
      .min(1, "Plan is required."),

    start_date: z
      .string()
      .min(1, "Start date is required."),

    end_date: z
      .string()
      .min(1, "End date is required."),
  })
  .refine(
    (values) =>
      !values.start_date ||
      !values.end_date ||
      values.end_date >= values.start_date,
    {
      message:
        "End date must be after the start date.",
      path: ["end_date"],
    },
  );

export type CreateSubscriptionFormValues =
  z.infer<typeof createSubscriptionSchema>;