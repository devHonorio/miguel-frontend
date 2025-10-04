"use server";

import { apiAuth } from "../auth/apiAuth";

export const setAddress = async (id: string) => {
  const api = await apiAuth();

  const response = await api.post(`/address/user/${id}`);

  return response.data;
};
