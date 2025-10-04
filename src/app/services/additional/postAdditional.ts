"use server";

import { apiAuth } from "../auth/apiAuth";
import { AdditionalType } from "@/app/(private)/admin/additional/hooks/schema";

export const postAdditional = async (
  data: Omit<AdditionalType, "priceTemplate">,
) => {
  const api = await apiAuth();

  const response = await api.post(`/additional`, data);

  return response.data;
};
