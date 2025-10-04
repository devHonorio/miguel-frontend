"use server";

import { CreateCupType } from "@/app/(private)/admin/cups/schema";
import { apiAuth } from "../auth/apiAuth";

export const postCups = async (data: CreateCupType) => {
  const api = await apiAuth();

  const response = await api.post(`/cups`, data);

  return response.data;
};
