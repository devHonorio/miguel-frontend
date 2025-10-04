import { useMutation, useQuery } from "@tanstack/react-query";
import { AdditionalType } from "../schema";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { parseAsBoolean, parseAsString, useQueryStates } from "nuqs";
import { queryClient } from "@/providers/react-query";
import { Additional } from "./useList";
import { patchAdditional } from "@/app/services/additional/patchAdditional";
import { getAdditional } from "@/app/services/additional/getAdditional";

export const useUpdate = (id: string) => {
  const [, setAdditionalStates] = useQueryStates({
    modalUpdate: parseAsBoolean.withDefault(false),
    idUpdate: parseAsString.withDefault(""),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: patchAdditional,

    onError: (error) => {
      console.error(error);

      if (error instanceof AxiosError) {
        return toast.error(error.response?.data.message);
      }

      toast.error("Erro ao salvar!");
    },

    onSuccess: (data: Additional) => {
      setAdditionalStates({ modalUpdate: false });
      toast.success("Adicional editado!");
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
      return await getAdditional(id);
    },
  });

  return { mutate, isPending, data, isLoading };
};
