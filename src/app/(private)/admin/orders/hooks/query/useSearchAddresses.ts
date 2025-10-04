import { getSearchAddresses } from "@/app/services/addresses/getSearchAddresses";
import { useQuery } from "@tanstack/react-query";

interface Address {
  id: string;
  address_complete: string;
  shipping_price: number;
}

export const useSearchAddresses = (query: string) => {
  const { data, isLoading } = useQuery<Address[]>({
    queryKey: ["addresses", query],
    queryFn: async () => {
      return getSearchAddresses(query);
    },
  });

  return { data, isLoading };
};
