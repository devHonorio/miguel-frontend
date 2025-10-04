"use server";

import { CreateAddress } from "@/app/(public)/address/new/[type]/[name]/[number]/[district]/[city]/form";
import { apiAuth } from "../auth/apiAuth";

export const postAddress = async (data: CreateAddress) => {
  const api = await apiAuth();

  const response = await api.post(`/address`, data);

  return response.data;
};
