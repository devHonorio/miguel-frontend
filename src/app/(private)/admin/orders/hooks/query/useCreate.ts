import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useApi } from "@/hooks";
import { parseAsBoolean, useQueryState } from "nuqs";
import { queryClient } from "@/providers/react-query";
import { revalidateCatalog } from "@/app/actions";
import { CreateCupType, CupUpdateType } from "../../../cups/schema";

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

    onSuccess: ({
      id,
      in_stock,
      price,
      size,
      description,
      quantity_additional,
    }: Omit<CupUpdateType, "priceTemplate">) => {
      setModalCreate(false);
      const cups = queryClient.getQueryData(["cups"]) as CupUpdateType[];

      cups.push({
        size,
        id,
        in_stock,
        price,
        description,
        quantity_additional,
      });

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
