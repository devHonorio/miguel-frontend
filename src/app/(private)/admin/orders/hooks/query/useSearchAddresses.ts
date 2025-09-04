import { useApi } from "@/hooks";
import { useQuery } from "@tanstack/react-query";

interface Address {
  id: string;
  address_complete: string;
  shipping_price: number;
}

export const useSearchAddresses = (query: string) => {
  const { api } = useApi();

  const { data, isLoading } = useQuery<Address[]>({
    queryKey: ["addresses", query],
    queryFn: async () => {
      const response = await api.get(`/address/search/${query}`);
      return response.data;
    },
  });

  return { data, isLoading };
};
