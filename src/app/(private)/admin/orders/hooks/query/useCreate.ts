import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { parseAsBoolean, useQueryState } from "nuqs";
import { queryClient } from "@/providers/react-query";
import { revalidateCatalog } from "@/app/actions";
import { CupUpdateType } from "../../../cups/schema";
import { postCups } from "@/app/services/cups/postCups";

export const useCreate = () => {
  const [, setModalCreate] = useQueryState(
    "modalCreate",
    parseAsBoolean.withDefault(false),
  );

  const { mutate, isPending } = useMutation({
    mutationFn: postCups,

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
