import {
    z,
  } from "zod";
  
  export const updateSchoolAdminSchema =
    z.object({
      first_name: z
        .string()
        .trim()
        .min(
          1,
          "First name is required.",
        )
        .max(100),
  
      middle_name: z
        .string()
        .trim()
        .max(100)
        .nullable(),
  
      last_name: z
        .string()
        .trim()
        .min(
          1,
          "Last name is required.",
        )
        .max(100),
  
      mobile_number: z
        .string()
        .trim()
        .min(
          1,
          "Mobile number is required.",
        )
        .max(20),
  
      profile_picture: z
        .string()
        .trim()
        .nullable(),
  
      status: z.enum([
        "ACTIVE",
        "INACTIVE",
        "LOCKED",
        "SUSPENDED",
        "ARCHIVED",
      ]),
    });
  
  export type UpdateSchoolAdminFormValues =
    z.infer<
      typeof updateSchoolAdminSchema
    >;