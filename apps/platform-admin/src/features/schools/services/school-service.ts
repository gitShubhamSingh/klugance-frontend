import {
    createSchool,
    getSchool,
    updateSchool,
    updateSchoolStatus
} from "../api";
  
import { CreateSchoolFormValues } from "../schemas/create-school.schema";
  
import {
    UpdateSchoolRequest,
    UpdateSchoolStatusRequest,
} from "../types";

export const schoolService = {
    create(
        payload: CreateSchoolFormValues,
    ) {
        return createSchool(payload);
    },

    get(id: string) {
        return getSchool(id);
    },
    update(
        id: string,
        payload: UpdateSchoolRequest,
      ) {
        return updateSchool(
          id,
          payload,
        );
      },
    updateStatus(
        id: string,
        payload: UpdateSchoolStatusRequest,
      ) {
        return updateSchoolStatus(
          id,
          payload,
        );
      },
};