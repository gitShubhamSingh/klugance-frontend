import {
    useMutation,
    useQueryClient,
  } from "@tanstack/react-query";
  
  import { deleteSchool } from "../api/delete-school";
  
  export function useDeleteSchool() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: deleteSchool,
  
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["schools"],
        });
      },
    });
  }