import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { parseAsBoolean, useQueryStates } from "nuqs";
import { queryClient } from "@/providers/react-query";
import { Additional } from "./useList";
import { postAdditional } from "@/app/services/additional/postAdditional";

export const useCreate = () => {
  const [, setAdditionalStates] = useQueryStates({
    modalCreate: parseAsBoolean.withDefault(false),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: postAdditional,

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
