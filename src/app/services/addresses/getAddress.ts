"use server";

import { apiAuth } from "../auth/apiAuth";

export const getAddress = async (id: string) => {
  const api = await apiAuth();

  const response = await api.get(`/addresses/${id}`);

  return response.data;
};
