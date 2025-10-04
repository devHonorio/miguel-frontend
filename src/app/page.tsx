import { verifyIsAdmin } from "@/middleware";
import { redirect } from "next/navigation";
import { getToken } from "./services/auth/getToken";

export default async function Home() {
  const token = await getToken();

  if (token) {
    const isAdmin = await verifyIsAdmin(token);

    if (isAdmin) redirect("/admin/orders");
  }
  redirect("/catalogo");
}
