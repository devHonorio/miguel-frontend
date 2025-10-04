"use server";

import { apiAuth } from "../auth/apiAuth";

export const getSearchAddresses = async (query: string) => {
  const api = await apiAuth();

  const response = await api.get(`/address/search/${query}`);

  return response.data;
};
