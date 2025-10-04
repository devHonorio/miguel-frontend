"use server";

import { apiAuth } from "../auth/apiAuth";

export const getAdditional = async (id: string) => {
  const api = await apiAuth();

  const response = await api.get(`/additional/${id}`);

  return response.data;
};
