"use server";
import { ONE_DAY_IN_SECONDS } from "@/app/(public)/admin/login/useQuery";
import { cookies } from "next/headers";

export const setToken = async (token: string) => {
  const cookiesStore = await cookies();

  cookiesStore.set("token", token, {
    httpOnly: true,
    secure: true,
    maxAge: ONE_DAY_IN_SECONDS * 300,
    path: "/",
  });
};
