import { School } from "./school";

export interface UpdateSchoolStatusRequest {
  status: School["status"];
}