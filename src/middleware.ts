import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const cookiesStore = await cookies();

  const token = cookiesStore.get("token")?.value;

  if (token) {
    const secret = new TextEncoder().encode(process.env.SECRET);

    const { payload } = await jwtVerify(token, secret);

    if (payload.is_admin)
      return NextResponse.redirect(new URL("/admin/cups", req.url));

    return NextResponse.redirect(new URL("/catalogo", req.url));
  }
}

export const config = {
  matcher: "/login",
};
