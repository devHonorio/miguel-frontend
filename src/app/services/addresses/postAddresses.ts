"use server";

import { CreateAddressType } from "@/app/(private)/admin/addresses/schema";
import { apiAuth } from "../auth/apiAuth";

export const postAddresses = async (data: CreateAddressType) => {
  const api = await apiAuth();

  const response = await api.post(`/addresses`, data);

  return response.data;
};
