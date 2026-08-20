import {
    createSchoolAdmin,
    getSchoolAdmin,
    getSchoolAdmins,
    updateSchoolAdmin,
    updateSchoolAdminStatus,
    deleteSchoolAdmin
  } from "../api";
  
  import type {
    CreateSchoolAdminFormValues,
  } from "../schemas";
  
  import type {
    UpdateSchoolAdminRequest,
    SchoolAdminStatus,
  } from "../types";
  
  export const schoolAdminService = {
    
    list() {
      return getSchoolAdmins();
    },
  
    get(userId: string) {
      return getSchoolAdmin(
        userId,
      );
    },
  
    create(
      payload: CreateSchoolAdminFormValues,
    ) {
      return createSchoolAdmin(
        payload,
      );
    },
  
    update(
      userId: string,
      payload: UpdateSchoolAdminRequest,
    ) {
      return updateSchoolAdmin(
        userId,
        payload,
      );
    },
    
    updateStatus(
        userId: string,
        status: SchoolAdminStatus,
      ) {
        return updateSchoolAdminStatus(
          userId,
          status,
        );
      },
    
    delete(
        userId: string,
      ) {
        return deleteSchoolAdmin(
          userId,
        );
      },
  };