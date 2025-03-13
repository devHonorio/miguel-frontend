import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { CreateCupType, CupUpdateType } from "../../schema";
import { toast } from "sonner";
import { useApi } from "@/hooks";
import { parseAsBoolean, useQueryState } from "nuqs";
import { queryClient } from "@/providers/react-query";
import { revalidateCatalog } from "@/app/actions";

export const useCreate = () => {
  const { api } = useApi();

  const [, setModalCreate] = useQueryState(
    "modalCreate",
    parseAsBoolean.withDefault(false),
  );

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: CreateCupType) => {
      const response = await api.post("/cups", data);

      return response.data;
    },

    onSuccess: (data: CupUpdateType, { size }) => {
      setModalCreate(false);
      const cups = queryClient.getQueryData(["cups"]) as CupUpdateType[];

      cups.push({ size, id: data.id });

      queryClient.setQueryData(["cups"], cups);
      setModalCreate(false);
      revalidateCatalog();
    },

    onError: (err: Error) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message ?? "Erro ao criar", {
          description: err.response?.data?.action,
        });
        return;
      }

      console.error(err);
      toast.error("Erro ao criar...");
    },
  });
  return { mutate, isPending };
};
