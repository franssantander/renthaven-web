import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/admin", "/tenant"];
const PUBLIC_ONLY_ROUTES = ["/login", "/"]; // Add routes you want to block for logged-in users

export const proxy = (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );
  const isPublicOnly = PUBLIC_ONLY_ROUTES.includes(pathname);

  // 1. GUEST trying to access PRIVATE page -> Redirect to Login
  if (isProtected && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. LOGGED IN user trying to access PUBLIC page (Home/Login) -> Stay on Dashboard
  if (isPublicOnly && token) {
    // Redirect them back to their dashboard (defaulting to tenant)
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
};

export const config = {
  // IMPORTANT: You must include "/" and "/login" in the matcher!
  matcher: ["/", "/login", "/admin/:path*", "/tenant/:path*"],
};
