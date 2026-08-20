import { useQuery } from "@tanstack/react-query";

import { getSchools } from "../api/get-schools";

export function useSchools() {
  return useQuery({
    queryKey: ["schools"],

    queryFn: getSchools,
  });
}