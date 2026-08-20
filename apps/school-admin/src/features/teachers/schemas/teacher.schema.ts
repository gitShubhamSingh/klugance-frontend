import { z } from "zod";

export const teacherSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1, "First name is required.")
    .max(100, "First name is too long."),

  middle_name: z
    .string()
    .trim()
    .max(100, "Middle name is too long.")
    .optional()
    .or(z.literal("")),

  last_name: z
    .string()
    .trim()
    .min(1, "Last name is required.")
    .max(100, "Last name is too long."),

  email: z
    .string()
    .trim()
    .email("Enter a valid email address."),

  mobile_number: z
    .string()
    .trim()
    .min(1, "Mobile number is required.")
    .max(30, "Mobile number is too long."),

  joining_date: z
    .string()
    .min(1, "Joining date is required."),

  employee_code: z
    .string()
    .trim()
    .min(1, "Employee code is required.")
    .max(50, "Employee code is too long."),

  qualification: z
    .string()
    .trim()
    .min(1, "Qualification is required.")
    .max(200, "Qualification is too long."),

  experience_years: z
    .number({
      error: "Experience is required.",
    })
    .int("Experience must be a whole number.")
    .min(0, "Experience cannot be negative.")
    .max(
      60,
      "Experience cannot be greater than 60 years.",
    ),

  bio: z
    .string()
    .trim()
    .max(2000, "Bio is too long.")
    .optional()
    .or(z.literal("")),
});

export type TeacherFormData = z.infer<
  typeof teacherSchema
>;