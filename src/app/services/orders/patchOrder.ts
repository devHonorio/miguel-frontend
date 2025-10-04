"use server";

import { CreateOrderType } from "@/app/(private)/admin/orders/schema";
import { apiAuth } from "../auth/apiAuth";

export const patchOrder = async (data: CreateOrderType & { id: string }) => {
  const api = await apiAuth();

  const response = await api.patch(`/orders`, data);

  return response.data;
};
