import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const jwtSecret = process.env.JWT_SECRET;

/**
 * Middleware for route protection and role-based access control.
 */
export async function middleware(req: NextRequest) {
  if (
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/register") ||
    req.nextUrl.pathname.startsWith("/profile") ||
    req.nextUrl.pathname.startsWith("/admin")
  ) {
    const token = req.cookies.get("access_token")?.value;
    if (
      !token &&
      (req.nextUrl.pathname.startsWith("/login") ||
        req.nextUrl.pathname.startsWith("/register"))
    ) {
      return NextResponse.next();
    }
    // If no token, redirect to login page for protected routes
    if (
      !token &&
      (req.nextUrl.pathname.startsWith("/admin") ||
        req.nextUrl.pathname.startsWith("/profile"))
    ) {
      return NextResponse.rewrite(new URL("/login", req.url));
    }
    // If token exists, verify and check user role
    if (token) {
      try {
        const { payload } = await jwtVerify(
          token,
          new TextEncoder().encode(jwtSecret)
        );

        // If accessing admin page and user is not admin, redirect
        if (
          req.nextUrl.pathname.startsWith("/admin") &&
          payload.role !== "admin"
        ) {
          return NextResponse.rewrite(new URL("/", req.url));
        }
        // If accessing register page and user is not admin, redirect
        if (
          req.nextUrl.pathname.startsWith("/register") ||
          (req.nextUrl.pathname.startsWith("/login") &&
            payload.role !== "admin")
        ) {
          return NextResponse.rewrite(new URL("/", req.url));
        }

        return NextResponse.next(); // Allow access if role matches
      } catch (error) {
        console.error(error);
        return NextResponse.rewrite(new URL("/", req.url));
      }
    }
  } else {
    return NextResponse.next();
  }
}
