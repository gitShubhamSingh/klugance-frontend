import {
    z,
  } from "zod";
  
  export const createSchoolAdminSchema =
    z.object({
      school_id: z
        .string()
        .min(
          1,
          "School is required.",
        ),
  
      role_code: z
        .string()
        .min(
          1,
          "Role is required.",
        ),
  
      first_name: z
        .string()
        .trim()
        .min(
          1,
          "First name is required.",
        )
        .max(
          100,
          "First name is too long.",
        ),
  
      middle_name: z
        .string()
        .trim()
        .max(
          100,
          "Middle name is too long.",
        )
        .optional(),
  
      last_name: z
        .string()
        .trim()
        .min(
          1,
          "Last name is required.",
        )
        .max(
          100,
          "Last name is too long.",
        ),
  
      email: z
        .string()
        .trim()
        .email(
          "Enter a valid email address.",
        ),
  
      mobile_number: z
        .string()
        .trim()
        .min(
          1,
          "Mobile number is required.",
        )
        .max(
          20,
          "Mobile number is too long.",
        ),
  
      password: z
        .string()
        .min(
          8,
          "Password must contain at least 8 characters.",
        )
        .max(
          128,
          "Password must not exceed 128 characters.",
        ),
    });
  
  export type CreateSchoolAdminFormValues =
    z.infer<
      typeof createSchoolAdminSchema
    >;