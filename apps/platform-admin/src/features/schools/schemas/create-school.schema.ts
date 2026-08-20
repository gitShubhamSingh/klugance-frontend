import { z } from "zod";

import { schoolSchema } from "./school-schema";
import { ownerSchema } from "./owner.schema";
import { principalSchema } from "./principal.schema";

export const createSchoolSchema = z.object({
  school: schoolSchema,

  owner: ownerSchema,

  principal: principalSchema,
});

export type CreateSchoolFormValues =
  z.infer<typeof createSchoolSchema>;