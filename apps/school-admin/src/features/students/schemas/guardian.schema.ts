import { z } from "zod";

export const guardianSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1, "First name is required.")
    .max(100, "First name is too long."),

  last_name: z
    .string()
    .trim()
    .min(1, "Last name is required.")
    .max(100, "Last name is too long."),

  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Enter a valid email address."),

  mobile_number: z
    .string()
    .trim()
    .min(1, "Contact number is required.")
    .regex(
      /^\+?[0-9\s-]{7,20}$/,
      "Enter a valid contact number.",
    ),

  occupation: z
    .string()
    .trim()
    .max(255, "Occupation is too long.")
    .optional()
    .or(z.literal("")),

  relationship_type: z.enum(
    ["FATHER", "MOTHER", "GUARDIAN"],
    {
      error: "Select a relationship.",
    },
  ),

  is_primary_contact: z.boolean(),
});

export type GuardianFormData = z.infer<
  typeof guardianSchema
>;
