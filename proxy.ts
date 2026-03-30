/**
 * Next.js 16 Proxy (replaces middleware.ts)
 * Protects private routes and redirects auth routes for logged-in users.
 */
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const PROTECTED_ROUTES = ["/home", "/dashboard", "/profile"];
const AUTH_ROUTES = ["/login", "/register"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("auth_token")?.value;
  const user = token ? verifyToken(token) : null;

  // Redirect unauthenticated users from protected routes → /login
  if (PROTECTED_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Redirect authenticated users from auth routes → /home
  if (AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    if (user) {
      return NextResponse.redirect(new URL("/home", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/home/:path*", "/dashboard/:path*", "/profile/:path*", "/login", "/register"],
};
