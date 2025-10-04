"use server";

import { CreateOrderType } from "@/app/(private)/admin/orders/schema";
import { apiAuth } from "../auth/apiAuth";

export const postOrder = async (data: CreateOrderType) => {
  const api = await apiAuth();

  const response = await api.post(`/orders`, data);

  return response.data;
};
