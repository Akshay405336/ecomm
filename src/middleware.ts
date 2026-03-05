import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(req: NextRequest) {

  const token = req.cookies.get("admin_token")?.value;

  console.log("---- MIDDLEWARE RUN ----");
  console.log("Path:", req.nextUrl.pathname);
  console.log("Token:", token);

  // Protect dashboard routes
  if (!token && req.nextUrl.pathname.startsWith("/admin/dashboard")) {
    console.log("No token → redirecting to /admin/login");

    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // Prevent logged-in admin from visiting login page again
  if (token && req.nextUrl.pathname === "/admin/login") {
    console.log("Token exists → redirecting to /admin/dashboard");

    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  console.log("Access allowed");

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};