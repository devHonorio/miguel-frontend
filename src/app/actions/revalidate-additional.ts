"use server";

import { revalidateTag } from "next/cache";

export async function revalidateAdditional() {
  revalidateTag("additional");
}
