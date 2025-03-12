import { useQuery } from "@tanstack/react-query";

import { useApi } from "@/hooks";
import { CupUpdateType } from "../../schema";

export const useGet = () => {
  const { api } = useApi();

  const { data, isPending } = useQuery<CupUpdateType[]>({
    queryKey: ["cups"],
    queryFn: async () => {
      const res = await api.get("/cups");

      return res.data;
    },
  });

  return { data, isPending };
};
