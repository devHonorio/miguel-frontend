import { useMutation } from "@tanstack/react-query";

import { toast } from "sonner";
import { AxiosError } from "axios";
import { queryClient } from "@/providers/react-query";
import { AddressResponse } from "./useGet";
import { useStates } from "./useStates";
import { deleteAddresses } from "@/app/services/addresses/deleteAddresses";

export const useDelete = () => {
  const { page, take, query, setAddressStates } = useStates();
  const { mutate, isPending } = useMutation({
    mutationFn: deleteAddresses,

    onSuccess: (_, id) => {
      toast.success("Endereço apagado!");
      const addresses = queryClient.getQueryData([
        "addresses",
        take,
        page,
        query,
      ]) as AddressResponse[];

      queryClient.setQueryData(
        ["addresses", take, page, query],
        addresses.filter((address) => address.id !== id),
      );

      setAddressStates({ idDelete: "", modalAlertDelete: false });
    },

    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message);
        console.log(err.response?.data);
        return;
      }

      console.log(err);
    },
  });

  return { mutate, isPending };
};
