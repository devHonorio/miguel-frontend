import { useApi } from "@/hooks";
import { useMutation } from "@tanstack/react-query";
import { AdditionalType } from "../schema";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { parseAsBoolean, useQueryStates } from "nuqs";
import { queryClient } from "@/providers/react-query";
import { Additional } from "./useList";

export const useCreate = () => {
  const { api } = useApi();

  const [, setAdditionalStates] = useQueryStates({
    modalCreate: parseAsBoolean.withDefault(false),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: Omit<AdditionalType, "priceTemplate">) => {
      console.info(data);
      const response = await api.post("/additional", data);

      return response.data;
    },

    onError: (error) => {
      console.error(error);

      if (error instanceof AxiosError) {
        return toast.error(error.response?.data.message);
      }

      toast.error("Erro ao salvar!");
    },

    onSuccess: (data: Additional) => {
      setAdditionalStates({ modalCreate: false });
      toast.success("Adicional criado!");
      const additional =
        (queryClient.getQueryData(["additional"]) as Additional[]) ?? [];

      additional.push(data);

      queryClient.setQueryData(["additional"], additional);
    },
  });

  return { mutate, isPending };
};
