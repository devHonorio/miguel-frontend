import { getAddresses } from "@/app/services/addresses/getAddresses";
import { useQuery } from "@tanstack/react-query";

export interface AddressResponse {
  id: string;
  address: string;
  shipping_price: number;
}
export const useGet = (take: number, page: number, query: string) => {
  const { data, isPending } = useQuery<AddressResponse[]>({
    queryKey: ["addresses", take, page, query],
    queryFn: async () => {
      return getAddresses(take, page, query);
    },
    initialData: [],
  });

  return { data, isPending };
};
