import { useApi } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { AdditionalType } from "../schema";

export interface Additional extends Omit<AdditionalType, "priceTemplate"> {
  id: string;
}

export const useList = () => {
  const { api } = useApi();

  const { data, isLoading } = useQuery({
    queryKey: ["additional"],
    queryFn: async () => {
      const response = await api.get<Additional[]>("additional");
      return response.data;
    },
  });
  return { data, isLoading };
};
