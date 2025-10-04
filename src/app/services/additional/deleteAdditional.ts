"use server";

import { apiAuth } from "../auth/apiAuth";

export const deleteAdditional = async (id: string) => {
  const api = await apiAuth();

  const response = await api.delete(`/additional/${id}`);

  return response.data;
};
