import { z } from "zod";

export const schoolSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "School name is required"),

  code: z
    .string()
    .trim()
    .min(2, "School code is required"),

  email: z
    .string()
    .trim()
    .email("Invalid email address"),

  mobile_number: z
    .string()
    .trim()
    .min(10, "Invalid mobile number"),

  website: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),

  address: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),

  description: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),
});

export type SchoolFormValues = z.infer<typeof schoolSchema>;