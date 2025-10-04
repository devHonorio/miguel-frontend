"use server";

import { apiAuth } from "../auth/apiAuth";

export const getAllAdditional = async () => {
  const api = await apiAuth();

  const response = await api.get("/additional");

  return response.data;
};
