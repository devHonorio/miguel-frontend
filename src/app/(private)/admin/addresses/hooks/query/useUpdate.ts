import { useMutation, useQuery } from "@tanstack/react-query";
import { useApi } from "@/hooks";
import { queryClient } from "@/providers/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import {
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from "nuqs";
import { CreateAddressType } from "../../schema";
import { AddressResponse } from "./useGet";

export const useUpdate = (id: string) => {
  const { api } = useApi();

  const [{ take, page, query }, setOrderStates] = useQueryStates({
    modalUpdate: parseAsBoolean.withDefault(false),

    take: parseAsInteger.withDefault(10),
    page: parseAsInteger.withDefault(0),
    query: parseAsString.withDefault(""),
  });

  const { data, isLoading } = useQuery<CreateAddressType>({
    queryKey: ["addresses", id],

    queryFn: async () => {
      const response = await api.get(`addresses/${id}`);
      return response.data;
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: CreateAddressType) => {
      const response = await api.patch(`/addresses/${id}`, data);
      return response.data as AddressResponse;
    },

    onSuccess: (data) => {
      let addresses = queryClient.getQueryData([
        "addresses",
        take,
        page,
        query,
      ]) as AddressResponse[];

      addresses = addresses.filter((address) => address.id !== id);

      queryClient.setQueryData(
        ["addresses", take, page, query],
        [data, ...addresses],
      );

      setOrderStates({ modalUpdate: false });
    },

    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message);
        console.log(err.response?.data);
        return;
      }
      console.log(err);
      toast.error("Erro ao atualizar!");
    },
  });

  return { data, isLoading, mutate, isPending };
};
