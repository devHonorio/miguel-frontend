import { setAddress } from "@/app/services/address/setAddress";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
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
  const { push } = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: setAddress,
    onError: (err) => {
      console.log(err);
      if (err instanceof AxiosError) {
      }
      toast.error("Erro ao adicionar endereço.");
    },

    onSuccess: () => {
      toast.success("Endereço adicionado.");
      push("/address");
    },
  });

  return (
    <div
      key={id}
      className="flex gap-2 rounded-md bg-black/5 px-4 py-2"
      onClick={() => {
        mutate(id);
      }}
    >
      <div>{index + 1} - </div>
      <p className="capitalize">{complement}</p>

      {isPending && <Loader2 className="animate-spin" />}
    </div>
  );
};
