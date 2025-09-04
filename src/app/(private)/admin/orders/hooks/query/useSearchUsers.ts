import { useApi } from "@/hooks";
import { useQuery } from "@tanstack/react-query";

interface User {
  id: string;
  name: string;
  phone: string;
}

export const useSearchUsers = (query: string) => {
  const { api } = useApi();

  const { data, isLoading } = useQuery<User[]>({
    queryKey: ["users", query],
    queryFn: async () => {
      const response = await api.get(`/users/${query}`);

      return response.data;
    },
  });

  return { data, isLoading };
};
