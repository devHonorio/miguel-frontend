import { useMutation } from "@tanstack/react-query";

import { toast } from "sonner";
import { AxiosError } from "axios";
import { queryClient } from "@/providers/react-query";
import { useApi } from "@/hooks";

export const useDelete = () => {
  const { api } = useApi();

  const { mutate, isPending } = useMutation({
    mutationFn: async (size: number) => {
      await api.delete(`/cups/${size}`);
    },

    onSuccess: (_, size) => {
      toast.success("Copo apagado!!");
      const cups =
        (queryClient.getQueryData(["cups"]) as { size: number }[]) ?? [];

      queryClient.setQueryData(
        ["cups"],
        cups.filter((cup) => cup.size !== size),
      );
    },

    onError: (err: AxiosError) => {
      toast.error(JSON.stringify(err.response?.data));
    },
  });

  return { mutate, isPending };
};
