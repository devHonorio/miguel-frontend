"use server";

import { apiAuth } from "../auth/apiAuth";

export const deleteAddresses = async (id: string) => {
  const api = await apiAuth();

  const response = await api.delete(`/addresses/${id}`);

  return response.data;
};
