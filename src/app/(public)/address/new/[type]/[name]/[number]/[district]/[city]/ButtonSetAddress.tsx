import { revalidateAddress } from "@/app/actions";
import { useApi } from "@/hooks";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ButtonSetAddressProps {
  id: string;
  index: number;
  complement: string;
}

export const ButtonSetAddress = ({
  id,
  index,
  complement,
}: ButtonSetAddressProps) => {
  const { api } = useApi();

  const { push } = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const response = await api.post(`/address/user/${id}`);

      return response.data;
    },
    onError: () => {
      toast.error("Erro ao adicionar endereço.");
    },

    onSuccess: () => {
      push("/address");
      revalidateAddress();
    },
  });

  return (
    <div
      key={id}
      className="flex gap-2 rounded-md bg-black/5 px-4 py-2"
      onClick={() => {
        mutate();
      }}
    >
      <div>{index + 1} - </div>
      <p className="capitalize">{complement}</p>

      {isPending && <Loader2 className="animate-spin" />}
    </div>
  );
};
