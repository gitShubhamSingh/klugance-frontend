import { z } from "zod";

export const sectionFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Section name is required")
    .max(100, "Section name is too long"),

  code: z
    .string()
    .trim()
    .min(1, "Section code is required")
    .max(100, "Section code is too long"),
});

export type SectionFormData =
  z.infer<typeof sectionFormSchema>;