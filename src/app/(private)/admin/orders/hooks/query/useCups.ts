import { api } from "@/app/(public)/services";
import { useQuery } from "@tanstack/react-query";
import { CupUpdateType } from "../../../cups/schema";

export const useCups = () => {
  const { data, isLoading } = useQuery<
    Pick<CupUpdateType, "id" | "price" | "size" | "quantity_additional">[]
  >({
    queryKey: ["cups"],
    queryFn: async () => {
      const response = await api.get("/cups");

      return response.data;
    },
  });

  return { data, isLoading };
};
