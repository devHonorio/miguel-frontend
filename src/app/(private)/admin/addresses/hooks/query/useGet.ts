import { useQuery } from "@tanstack/react-query";

import { useApi } from "@/hooks";

export interface AddressResponse {
  id: string;
  address: string;
  shipping_price: number;
}
export const useGet = (take: number, page: number, query: string) => {
  const { api } = useApi();

  const { data, isPending } = useQuery<AddressResponse[]>({
    queryKey: ["addresses", take, page, query],
    queryFn: async () => {
      const res = await api.get(
        `/addresses?take=${take}&page=${page}&query=${query}`,
      );

      return res.data;
    },
    initialData: [],
  });

  return { data, isPending };
};
