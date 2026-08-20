import { School } from "./school";

export interface SchoolPerson {
  id: string;

  email: string | null;
  mobile_number: string | null;

  first_name: string;
  middle_name: string | null;
  last_name: string;

  profile_picture: string | null;
}

export interface SchoolDetail {
  school: School;

  owner: SchoolPerson | null;

  principal: SchoolPerson | null;
}