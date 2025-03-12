import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

interface PathType {
  [key: string]: (req: NextRequest, token?: string) => unknown;
}

const secret = new TextEncoder().encode(process.env.SECRET);

const verifyIsAdmin = async (token: string) => {
  const { payload } = await jwtVerify(token, secret);

  return payload.is_admin as boolean;
};

const paths: PathType = {
  "/admin/cups": async (req, token) => {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const isAdmin = await verifyIsAdmin(token);

    if (!isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  "/login": async (req, token) => {
    if (token) {
      const isAdmin = await verifyIsAdmin(token);

      if (isAdmin)
        return NextResponse.redirect(new URL("/admin/cups", req.url));

      return NextResponse.redirect(new URL("/", req.url));
    }
  },
};
export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (!paths[pathname]) return;

  const cookiesStore = await cookies();

  const token = cookiesStore.get("token")?.value;

  return paths[pathname](req, token);
}

export const config = {
  matcher: ["/login", "/admin/:path*"],
};
