"use server";

import { apiAuth } from "../auth/apiAuth";

export const deleteUserAddresses = async (id: string) => {
  const api = await apiAuth();

  const response = await api.delete(`/address/user/${id}`);

  return response.data;
};
