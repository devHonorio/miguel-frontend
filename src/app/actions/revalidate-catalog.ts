"use server";

import { revalidatePath, revalidateTag } from "next/cache";

export async function revalidateCatalog() {
  revalidatePath("/catalogo");
  revalidateTag("cups-id");
}
