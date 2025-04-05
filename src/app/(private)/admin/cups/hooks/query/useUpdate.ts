import { useMutation, useQuery } from "@tanstack/react-query";
import { useApi } from "@/hooks";
import { queryClient } from "@/providers/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { parseAsBoolean, useQueryState } from "nuqs";
import { CupUpdateType } from "../../schema";
import { revalidateCatalog } from "@/app/actions";

export const useUpdate = (id: string) => {
  const { api } = useApi();

  const [, setModalUpdate] = useQueryState(
    "modalUpdate",
    parseAsBoolean.withDefault(false),
  );

  const { data, isLoading } = useQuery<CupUpdateType>({
    queryKey: ["cup"],

    queryFn: async () => {
      const response = await api.get(`cups/${id}`);
      return response.data;
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ id, ...data }: CupUpdateType) => {
      const response = await api.patch(`/cups/${id}`, data);
      return response.data as CupUpdateType;
    },

    onSuccess: (data) => {
      let cups = queryClient.getQueryData(["cups"]) as CupUpdateType[];

      cups = cups.filter((cup) => cup.id !== data.id);

      cups.push(data);

      cups.sort((a, b) => a.size - b.size);

      queryClient.setQueryData(["cups"], cups);

      setModalUpdate(false);
      revalidateCatalog();
    },

    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message);
        return;
      }

      toast.error("Erro ao atualizar!");
    },
  });

  return { data, isLoading, mutate, isPending };
};
