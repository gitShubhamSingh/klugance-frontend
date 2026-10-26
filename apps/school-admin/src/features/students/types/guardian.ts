/*
 * Mirrors backend_v2 `ParentRelationshipType`
 * (app/modules/people/models/student_parent.py).
 */
export type GuardianRelationship =
  | "FATHER"
  | "MOTHER"
  | "GUARDIAN";

export const GUARDIAN_RELATIONSHIP_LABELS: Record<
  GuardianRelationship,
  string
> = {
  FATHER: "Father",
  MOTHER: "Mother",
  GUARDIAN: "Guardian",
};

/*
 * A parent profile joined with its link to one
 * student (parent_profiles + student_parents).
 * Mirrors backend_v2 `StudentParentResponse`.
 */
export type StudentGuardian = {
  /** student_parents link id */
  id: string;

  student_profile_id: string;
  parent_profile_id: string;
  parent_user_id: string;

  first_name: string;
  middle_name: string | null;
  last_name: string;

  email: string;
  mobile_number: string;

  occupation: string | null;
  emergency_contact: string | null;

  relationship_type: GuardianRelationship;
  is_primary_contact: boolean;

  created_at: string | null;

  /**
   * Only on link responses: true when a new parent
   * portal account was registered, false when an
   * existing parent (e.g. a sibling's) was reused.
   */
  parent_account_created?: boolean | null;
};

/*
 * POST /school/students/{id}/parents body. Either
 * `parent_id` (link a registered parent) or the
 * parent details; a matching email reuses the
 * existing parent account instead of creating one.
 */
export type LinkStudentGuardianPayload = {
  parent_id?: string;

  first_name?: string;
  middle_name?: string | null;
  last_name?: string;

  email?: string;
  mobile_number?: string;

  occupation?: string | null;
  emergency_contact?: string | null;

  relationship_type: GuardianRelationship;
  is_primary_contact: boolean;
};
