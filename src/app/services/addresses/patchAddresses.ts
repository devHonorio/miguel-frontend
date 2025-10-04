"use server";

import { CreateAddressType } from "@/app/(private)/admin/addresses/schema";
import { apiAuth } from "../auth/apiAuth";

export const patchAddresses = async ({
  id,
  ...data
}: CreateAddressType & { id: string }) => {
  const api = await apiAuth();

  const response = await api.patch(`/addresses/${id}`, data);

  return response.data;
};
