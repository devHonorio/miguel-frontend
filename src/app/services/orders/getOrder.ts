"use server";

import { apiAuth } from "../auth/apiAuth";

export const getOrder = async (id: string) => {
  const api = await apiAuth();

  const response = await api.get(`/orders/${id}`);

  return response.data;
};
