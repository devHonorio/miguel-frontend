"use server";

import { apiAuth } from "../auth/apiAuth";

export const getOrders = async (skip: number, take: number, search: string) => {
  const api = await apiAuth();

  const response = await api.get(
    `/orders?search=${search}&take=${take}&skip=${skip}`,
  );

  return response.data;
};
