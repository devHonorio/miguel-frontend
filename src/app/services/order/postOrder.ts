"use server";

import { apiAuth } from "../auth/apiAuth";

interface PostOrder {
  hour: string;
  paymentMethod: "pix" | "credit" | "debit" | "cash";
  change?: string;
}
export const postOrder = async (data: PostOrder) => {
  const api = await apiAuth();

  const response = await api.post(`/order`, data);

  return response.data;
};
