import { useQuery } from "@tanstack/react-query";
import { AdditionalType } from "../schema";
import { getAllAdditional } from "@/app/services/additional/getAllAdditional";

export interface Additional extends Omit<AdditionalType, "priceTemplate"> {
  id: string;
}

export const useList = () => {
  const { data, isLoading } = useQuery<Additional[]>({
    queryKey: ["additional"],
    queryFn: getAllAdditional,
    initialData: [],
  });
  return { data, isLoading };
};
