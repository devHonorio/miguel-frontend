"use server";

import { apiAuth } from "../auth/apiAuth";
import { AdditionalType } from "@/app/(private)/admin/additional/hooks/schema";

export const patchAdditional = async ({
  id,
  ...data
}: Omit<AdditionalType, "priceTemplate"> & { id: string }) => {
  const api = await apiAuth();

  const response = await api.patch(`/additional/${id}`, data);

  return response.data;
};
