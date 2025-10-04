import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useApi } from "@/hooks";
import { queryClient } from "@/providers/react-query";
import { CreateAddressType } from "../../schema";
import { AddressResponse } from "./useGet";
import { useStates } from "./useStates";

export const useCreate = () => {
  const { api } = useApi();

  const { take, page, query, setAddressStates } = useStates();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: CreateAddressType) => {
      const response = await api.post("/addresses", data);

      return response.data;
    },

    onSuccess: ({ id, address, shipping_price }: AddressResponse) => {
      const addresses = queryClient.getQueryData([
        "addresses",
        take,
        page,
        query,
      ]) as AddressResponse[];

      addresses.push({
        address,
        id,
        shipping_price,
      });

      queryClient.setQueryData(["addresses", take, page, query], addresses);
      setAddressStates({ modalCreate: false });
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
