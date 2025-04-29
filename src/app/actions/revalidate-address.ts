"use server";

import { revalidatePath } from "next/cache";

export async function revalidateAddress() {
  revalidatePath("/address");
}
