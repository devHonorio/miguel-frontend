"use server";

import { apiAuth } from "../auth/apiAuth";

export const getCup = async (id: string) => {
  const api = await apiAuth();

  const response = await api.get(`/cups/${id}`);

  return response.data;
};
