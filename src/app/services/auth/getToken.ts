"use server";
import { cookies } from "next/headers";

export const getToken = async () => {
  const cookiesStore = await cookies();

  return cookiesStore.get("token")?.value;
};
