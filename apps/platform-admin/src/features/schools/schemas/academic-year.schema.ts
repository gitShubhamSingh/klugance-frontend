
import { z } from "zod";

const isoDateSchema = z
  .string()
  .min(1, "Date is required")
  .refine((value) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return false;
    }

    const date = new Date(`${value}T00:00:00.000Z`);

    return (
      !Number.isNaN(date.getTime()) &&
      date.toISOString().slice(0, 10) === value
    );
  }, "Enter a valid date in YYYY-MM-DD format");

export const academicYearSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Academic year name is required")
      .max(100, "Academic year name is too long"),

    start_date: isoDateSchema,

    end_date: isoDateSchema,

    is_current: z.boolean(),
  })
  .superRefine((value, ctx) => {
    if (
      /^\d{4}-\d{2}-\d{2}$/.test(value.start_date) &&
      /^\d{4}-\d{2}-\d{2}$/.test(value.end_date) &&
      !Number.isNaN(Date.parse(value.start_date)) &&
      !Number.isNaN(Date.parse(value.end_date)) &&
      value.end_date <= value.start_date
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["end_date"],
        message: "End date must be later than start date",
      });
    }
  });
