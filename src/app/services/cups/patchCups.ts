"use server";

import { CupUpdateType } from "@/app/(private)/admin/cups/schema";
import { apiAuth } from "../auth/apiAuth";

export const patchCups = async ({ id, ...data }: CupUpdateType) => {
  const api = await apiAuth();

  const response = await api.patch(`/cups/${id}`, data);

  return response.data as CupUpdateType;
};
