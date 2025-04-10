import { useApi } from "@/hooks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AdditionalType } from "../schema";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { parseAsBoolean, parseAsString, useQueryStates } from "nuqs";
import { queryClient } from "@/providers/react-query";
import { Additional } from "./useList";

export const useUpdate = (id: string) => {
  const { api } = useApi();

  const [, setAdditionalStates] = useQueryStates({
    modalUpdate: parseAsBoolean.withDefault(false),
    idUpdate: parseAsString.withDefault(""),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: Omit<AdditionalType, "priceTemplate">) => {
      const response = await api.patch("/additional", data);

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
      setAdditionalStates({ modalUpdate: false });
      toast.success("Adicional criado!");
      let additional =
        (queryClient.getQueryData(["additional"]) as Additional[]) ?? [];

      additional = additional.filter(({ id }) => data.id !== id);

      additional.push(data);

      additional.sort((a, b) => a.name.localeCompare(b.name));

      queryClient.setQueryData(["additional"], additional);
    },
  });

  const { data, isLoading } = useQuery<AdditionalType>({
    queryKey: ["additional", id],

    queryFn: async () => {
      const response = await api.get(`additional/${id}`);
      return response.data;
    },
  });

  return { mutate, isPending, data, isLoading };
};
