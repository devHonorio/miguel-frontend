import { useQuery as TUseQuery } from "@tanstack/react-query";

import { api } from "@/services/api";
import { CreateCupType } from "./create/schema";

export const useQuery = () => {
  const { data, isPending } = TUseQuery<CreateCupType[]>({
    queryKey: ["cups"],
    queryFn: async () => {
      const res = await api.get("/cups");

      return res.data;
    },
  });

  return { data, isPending };
};
