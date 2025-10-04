"use server";

import { apiAuth } from "../auth/apiAuth";

export const deleteCups = async (size: number) => {
  const api = await apiAuth();

  const response = await api.delete(`/cups/${size}`);

  return response.data;
};
