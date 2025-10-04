"use server";

import { apiAuth } from "../auth/apiAuth";

export const deleteOrder = async (id: string) => {
  const api = await apiAuth();

  const response = await api.delete(`/orders/${id}`);

  return response.data;
};
