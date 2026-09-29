import { z } from "zod";

export const subjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(
      1,
      "Subject name is required.",
    )
    .max(
      150,
      "Subject name is too long.",
    ),

  code: z
    .string()
    .trim()
    .max(
      50,
      "Subject code is too long.",
    )
    .optional()
    .or(z.literal("")),

  description: z
    .string()
    .trim()
    .max(
      1000,
      "Description is too long.",
    )
    .optional()
    .or(z.literal("")),

  is_mandatory: z.boolean(),
});

export type SubjectFormData =
  z.infer<typeof subjectSchema>;