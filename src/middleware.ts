import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "./app/utils/rateLimiting";
import { verifyAccessToken } from "./app/lib/services/authService";

/**
 * Middleware for route protection and role-based access control.
 */
export async function middleware(req: NextRequest) {
	const ip = req.headers.get("x-forwarded-for") || "unknown";

	if (req.nextUrl.pathname.startsWith("/api") && req.nextUrl.pathname !== "/api/auth/logout") {
		if (!checkRateLimit(ip)) {
			return NextResponse.json({ response: "Too many requests, please try again later" }, { status: 429 });
		}
	}

	if (
		req.nextUrl.pathname.startsWith("/login") ||
		req.nextUrl.pathname.startsWith("/logout") ||
		req.nextUrl.pathname.startsWith("/register") ||
		req.nextUrl.pathname.startsWith("/profile") ||
		req.nextUrl.pathname.startsWith("/admin")
	) {
		const token = req.cookies.get("access_token")?.value;
		if (!token) {
			if (req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register")) {
				return NextResponse.next();
			}
			// If no token, redirect to login page for protected routes
			if (req.nextUrl.pathname.startsWith("/admin") || req.nextUrl.pathname.startsWith("/profile")) {
				return NextResponse.rewrite(new URL("/login", req.url));
			}
		} else {
			// If token exists, verify and check user role
			try {
				const payload = await verifyAccessToken(token);

				if (!payload) {
					if (req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register")) {
						return NextResponse.next();
					}
					return NextResponse.rewrite(new URL("/", req.url));
				}

				// If accessing admin page and user is not admin, redirect
				if (req.nextUrl.pathname.startsWith("/admin") && payload.role !== "admin") {
					return NextResponse.rewrite(new URL("/", req.url));
				}
				// If accessing register page and user is not admin, redirect
				if (
					req.nextUrl.pathname.startsWith("/register") ||
					(req.nextUrl.pathname.startsWith("/login") && payload.role !== "admin")
				) {
					return NextResponse.rewrite(new URL("/", req.url));
				}

				return NextResponse.next(); // Allow access if role matches
			} catch (err) {
				return NextResponse.rewrite(new URL("/", req.url));
			}
		}
	} else {
		return NextResponse.next();
	}
}
