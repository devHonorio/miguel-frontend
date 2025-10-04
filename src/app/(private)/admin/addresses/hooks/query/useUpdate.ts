import { useMutation, useQuery } from "@tanstack/react-query";
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
import { getAddress } from "@/app/services/addresses/getAddress";
import { patchAddresses } from "@/app/services/addresses/patchAddresses";

export const useUpdate = (id: string) => {
  const [{ take, page, query }, setOrderStates] = useQueryStates({
    modalUpdate: parseAsBoolean.withDefault(false),

    take: parseAsInteger.withDefault(10),
    page: parseAsInteger.withDefault(0),
    query: parseAsString.withDefault(""),
  });

  const { data, isLoading } = useQuery<CreateAddressType>({
    queryKey: ["addresses", id],

    queryFn: async () => {
      return await getAddress(id);
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: CreateAddressType) => {
      return (await patchAddresses({ id, ...data })) as AddressResponse;
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
