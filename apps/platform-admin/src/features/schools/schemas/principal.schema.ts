import { z } from "zod";

export const principalSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address"),

  mobile_number: z
    .string()
    .trim()
    .min(10, "Invalid mobile number"),

  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters"),

  first_name: z
    .string()
    .trim()
    .min(1, "First name is required"),

  middle_name: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),

  last_name: z
    .string()
    .trim()
    .min(1, "Last name is required"),
});

export type PrincipalFormValues = z.infer<
  typeof principalSchema
>;