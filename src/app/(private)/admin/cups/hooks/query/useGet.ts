import { useQuery } from "@tanstack/react-query";

import { CupUpdateType } from "../../schema";
import { getCups } from "@/app/services/cups/getCups";

export const useGet = () => {
  const { data, isPending } = useQuery<CupUpdateType[]>({
    queryKey: ["cups"],
    queryFn: getCups,
  });

  return { data, isPending };
};
