import { getSearchUsers } from "@/app/services/users/getSearchUsers";
import { useQuery } from "@tanstack/react-query";

interface User {
  id: string;
  name: string;
  phone: string;
}

export const useSearchUsers = (query: string) => {
  const { data, isLoading } = useQuery<User[]>({
    queryKey: ["users", query],
    queryFn: async () => {
      return getSearchUsers(query);
    },
  });

  return { data, isLoading };
};
