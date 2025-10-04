"use server";

import { apiAuth } from "../auth/apiAuth";

export const getSearchUsers = async (query: string) => {
  const api = await apiAuth();

  const response = await api.get(`/users/${query}`);

  return response.data;
};
