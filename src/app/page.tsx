import { verifyIsAdmin } from "@/middleware";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookiesStore = await cookies();

  const token = cookiesStore.get("token")?.value;

  if (token) {
    const isAdmin = await verifyIsAdmin(token);

    if (isAdmin) redirect("/admin/cups");
  }
  redirect("/catalogo");
}
