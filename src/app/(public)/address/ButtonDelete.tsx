"use client";

import { revalidateAddress } from "@/app/actions";
import { deleteUserAddresses } from "@/app/services/addresses/deleteUserAddresses";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export const ButtonDelete = ({ id }: { id: string }) => {
  const { mutate } = useMutation({
    mutationFn: deleteUserAddresses,

    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
        return;
      }

      toast.error("Erro ao apagar endereço.");
      console.error(error);
    },

    onSuccess: () => {
      toast.success("Endereço removido.");
      revalidateAddress();
    },
  });

  return (
    <Button
      variant="destructive"
      size="icon"
      onClick={() => {
        mutate(id);
      }}
    >
      <Trash2 />
    </Button>
  );
};
