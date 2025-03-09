import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookiesStore = await cookies();

  const token = cookiesStore.get("token")?.value;

  if (token) {
    const secret = new TextEncoder().encode(process.env.SECRET);

    const { payload } = await jwtVerify(token, secret);

    if (payload.is_admin) redirect("/admin/cups");
  }
  redirect("/catalogo");

  return <></>;
}
