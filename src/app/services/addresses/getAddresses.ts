"use server";

import { apiAuth } from "../auth/apiAuth";

export const getAddresses = async (
  take: number,
  page: number,
  query: string,
) => {
  const api = await apiAuth();

  const response = await api.get(
    `/addresses?take=${take}&page=${page}&query=${query}`,
  );

  return response.data;
};
