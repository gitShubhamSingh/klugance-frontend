import { useQuery } from "@tanstack/react-query";

import { getSubjects } from "../api/subjects-api";

import { subjectQueryKeys } from "../constants/subject-query-keys";

export function useSubjects() {
  return useQuery({
    queryKey: subjectQueryKeys.list(),

    queryFn: getSubjects,
  });
}