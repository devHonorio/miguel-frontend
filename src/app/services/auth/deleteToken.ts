"use server";
import { cookies } from "next/headers";

export const deleteToken = async () => {
  const cookiesStore = await cookies();

  cookiesStore.delete("token");
};
