import axios, { AxiosError } from "axios";
import { deleteCookie, getCookie } from "cookies-next";

export const useApi = () => {
  const token = getCookie("token");

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });

  api.interceptors.response.use(
    (res) => res,
    (err: AxiosError) => {
      console.log(err.response?.data);
      if (err.status === 401) deleteCookie("token");
      throw err;
    },
  );

  return { api };
};
