import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { api } from "../services";

export const useQuery = () => {
  const { push } = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (phone: string) => {
      const response = await api.post("/send-code", { phone });

      return response.data;
    },

    onSuccess: (name: string, phone) => {
      push(`verify-code/${phone}/${name}`);
    },

    onError: (err: Error, phone) => {
      if (err instanceof AxiosError) {
        if (err.status === 404) {
          push(`/signup/${phone}`);
          return;
        }

        console.log(err.response?.data);
        toast.error(err.response?.data.message);
        return;
      }

      console.error(err);
      toast.error("Erro ao logar...");
    },
  });
  return { mutate, isPending };
};
