import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { LoginType } from "./schema";
import { toast } from "sonner";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { api } from "../services";

const ONE_DAY_IN_SECONDS = 86400;

export const useQuery = () => {
  const { push } = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: LoginType) => {
      const response = await api.post<{ access_token: string }>("/login", data);

      return response.data.access_token;
    },

    onSuccess: (token: string) => {
      if (!token) {
        toast("BASE_URL: " + process.env.BACK_URL);
        return;
      }
      setCookie("token", token, { maxAge: ONE_DAY_IN_SECONDS * 300 });
      push("/");
      toast.success("Logado com sucesso!");
    },

    onError: (err: Error) => {
      if (err instanceof AxiosError) {
        toast.error(JSON.stringify(err.response?.data.message));
        return;
      }

      console.error(err);
      toast.error("Erro ao logar...");
    },
  });
  return { mutate, isPending };
};
