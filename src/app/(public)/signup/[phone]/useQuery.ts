import { useMutation } from "@tanstack/react-query";
import { api } from "../../services";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useQuery = () => {
  const { push } = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: async ({ name, phone }: { name: string; phone: string }) => {
      await api.post("/signup", { name, phone });
    },

    onSuccess: (_, { name, phone }) => {
      push(`/verify-code/${phone}/${name}`);
    },

    onError: (err: Error) => {
      if (err instanceof AxiosError) {
        console.log(err.response?.data);
        toast.error(err.response?.data.message);
        return;
      }

      toast.error("Erro ao criar!");
    },

    //     toast.error(JSON.stringify(err.response?.data.message));
    //     return;
    //   }

    //   console.error(err);
    //   toast.error("Erro ao logar...");
    // },
  });
  return { mutate, isPending };
};
