import { z } from "zod";

export const classSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Class name is required")
    .max(100),

  code: z
    .string()
    .trim()
    .min(1, "Class code is required")
    .max(100),

  description: z
    .string()
    .trim()
    .max(500)
    .optional()
    .default(""),
});

export type ClassFormData =
  z.infer<typeof classSchema>;