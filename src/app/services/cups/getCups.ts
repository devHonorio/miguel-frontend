"use server";

import { apiAuth } from "../auth/apiAuth";

export const getCups = async () => {
  const api = await apiAuth();

  const response = await api.get("/cups");

  return response.data;
};
