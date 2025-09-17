import { ONE_DAY_IN_SECONDS } from "@/app/(public)/admin/login/useQuery";
import { api } from "@/app/(public)/services";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useQuery = () => {
  const { push } = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: { code: string; phone: string }) => {
      const response = await api.post("/verify-code", data);

      return response.data;
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
      console.log(err);
      if (err instanceof AxiosError) {
        if (err.status === 401) {
          toast.error("Código inválido.");
          return;
        }

        toast.error(JSON.stringify(err.response?.data.message));
        return;
      }

      toast.error("Erro ao logar...");
    },
  });
  return { mutate, isPending };
};
