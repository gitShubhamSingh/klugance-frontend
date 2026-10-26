/* Mirrors backend_v2 `ParentChildResponse`. */
export type ParentChild = {
  student_profile_id: string;
  /** null when the student has no active enrollment this year. */
  enrollment_id: string | null;

  first_name: string;
  middle_name: string | null;
  last_name: string;

  admission_number: string;
  roll_number: string | null;

  class_id: string | null;
  class_name: string | null;
  section_id: string | null;
  section_name: string | null;

  gender: "MALE" | "FEMALE" | "OTHER" | null;
  date_of_birth: string | null;

  relationship_type: "FATHER" | "MOTHER" | "GUARDIAN";
  is_primary_contact: boolean;

  class_teachers: string[];
};

export function childName(child: Pick<ParentChild, "first_name" | "middle_name" | "last_name">) {
  return [child.first_name, child.middle_name, child.last_name].filter(Boolean).join(" ");
}

export function childClassLabel(child: Pick<ParentChild, "class_name" | "section_name">) {
  if (!child.class_name) return "Not enrolled this year";
  return child.section_name ? `${child.class_name} – ${child.section_name}` : child.class_name;
}
