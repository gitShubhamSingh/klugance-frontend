import { z } from "zod";

export const academicYearSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Academic year name is required")
      .max(100, "Name is too long"),

    start_date: z
      .string()
      .min(1, "Start date is required"),

    end_date: z
      .string()
      .min(1, "End date is required"),

    is_current: z.boolean(),
  })
  .refine(
    (data) =>
      new Date(data.end_date) >
      new Date(data.start_date),
    {
      message:
        "End date must be after start date",
      path: ["end_date"],
    },
  );

export type AcademicYearFormData =
  z.infer<typeof academicYearSchema>;