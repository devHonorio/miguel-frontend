import { api } from "@/app/(public)/services";
import { AxiosError } from "axios";
import { deleteToken } from "./deleteToken";
import { getToken } from "./getToken";

export const apiAuth = async () => {
  const token = await getToken();
  api.interceptors.response.use(
    (res) => res,
    async (err: AxiosError) => {
      console.log(err.response?.data);
      if (err.status === 401) await deleteToken();
      throw err;
    },
  );

  api.interceptors.request.use((req) => {
    req.headers.set("Authorization", token ? `Bearer ${token}` : "");

    return req;
  });

  return api;
};
