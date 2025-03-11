import axios, { AxiosError } from "axios";
import { deleteCookie, getCookie } from "cookies-next";

export const useApi = () => {
  const token = getCookie("token");

  const api = axios.create({
    baseURL: "http://localhost:3001",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });

  api.interceptors.response.use(
    (res) => res,
    (err: AxiosError) => {
      if (err.status === 401) deleteCookie("token");
      throw err;
    },
  );

  return { api };
};
