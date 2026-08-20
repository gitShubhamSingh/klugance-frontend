import { z } from "zod";

export const updateSchoolSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "School name is required"),

  email: z
    .string()
    .trim()
    .email("Enter a valid email address"),

  mobile_number: z
    .string()
    .trim()
    .min(1, "Mobile number is required"),

  website: z
    .string()
    .trim()
    .url("Enter a valid website URL")
    .or(z.literal("")),

  address: z
    .string()
    .trim()
    .min(1, "Address is required"),

  description: z
    .string()
    .trim(),
});

export type UpdateSchoolFormValues =
  z.infer<typeof updateSchoolSchema>;