import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { LoginType } from "./schema";
import { toast } from "sonner";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";

const ONE_DAY_IN_SECONDS = 86400;

const signIn = async (data: LoginType) => {
  const response = await axios.post<{ access_token: string }>(
    "http://localhost:3001/login",
    data,
  );

  return response.data.access_token;
};

const signInSuccess = (token: string, action: (url: string) => void) => {
  setCookie("token", token, { maxAge: ONE_DAY_IN_SECONDS * 300 });
  action("/");
  toast.success("Logado com sucesso!");
};

const signInError = (err: Error) => {
  if (err instanceof AxiosError) {
    toast.error(JSON.stringify(err.response?.data.message));
    return;
  }

  console.error(err);
  toast.error("Erro ao logar...");
};

export const useQuery = () => {
  const { push } = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: signIn,

    onSuccess: (token) => signInSuccess(token, push),

    onError: signInError,
  });
  return { mutate, isPending };
};
