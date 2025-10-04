import { useMutation } from "@tanstack/react-query";

import { toast } from "sonner";
import { AxiosError } from "axios";
import { queryClient } from "@/providers/react-query";
import { parseAsBoolean, parseAsString, useQueryStates } from "nuqs";
import { AdditionalType } from "../schema";
import { deleteAdditional } from "@/app/services/additional/deleteAdditional";

export const useDelete = () => {
  const [, setAdditionalStates] = useQueryStates({
    modalAlertDelete: parseAsBoolean.withDefault(true),
    ideDelete: parseAsString.withDefault(""),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: deleteAdditional,

    onSuccess: (_, id) => {
      toast.success("Adicional apagado!!");
      const additional =
        (queryClient.getQueryData(["additional"]) as AdditionalType[]) ?? [];

      queryClient.setQueryData(
        ["additional"],
        additional.filter((additionalItem) => additionalItem.id !== id),
      );

      setAdditionalStates({ ideDelete: "", modalAlertDelete: false });
    },

    onError: (err) => {
      console.error(err);

      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message);
        return;
      }

      toast.error("Erro ao apagar!");
    },
  });

  return { mutate, isPending };
};
