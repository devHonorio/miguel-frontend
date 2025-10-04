import { useMutation } from "@tanstack/react-query";

import { toast } from "sonner";
import { AxiosError } from "axios";
import { queryClient } from "@/providers/react-query";
import { revalidateCatalog } from "@/app/actions";
import { parseAsBoolean, parseAsInteger, useQueryStates } from "nuqs";
import { deleteCups } from "@/app/services/cups/deleteCups";

export const useDelete = () => {
  const [, setCupStates] = useQueryStates({
    modalAlertDelete: parseAsBoolean,
    sizeDelete: parseAsInteger,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (size: number) => {
      await deleteCups(size);
    },

    onSuccess: (_, size) => {
      toast.success("Copo apagado!!");
      const cups =
        (queryClient.getQueryData(["cups"]) as { size: number }[]) ?? [];

      queryClient.setQueryData(
        ["cups"],
        cups.filter((cup) => cup.size !== size),
      );
      revalidateCatalog();
      setCupStates({ sizeDelete: 0, modalAlertDelete: false });
    },

    onError: (err: AxiosError) => {
      toast.error(JSON.stringify(err.response?.data));
    },
  });

  return { mutate, isPending };
};
