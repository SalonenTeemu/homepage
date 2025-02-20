import { NextRequest, NextResponse } from "next/server";
import { LRUCache } from "lru-cache";
import { verifyAccessToken } from "./app/lib/services/authService";

// Request object with user property
export interface ExtendedRequest extends NextRequest {
	user?: any;
}

// Define rate limiting settings
const rateLimitOptions = {
	max: 200, // Max requests per IP
	ttl: 60 * 10 * 1000, // 10 minutes
};

const rateLimiter = new LRUCache<string, number>(rateLimitOptions);

/**
 * Check if the request is within the rate limit for the given IP address.
 *
 * @param ip The IP address of the client
 * @returns The rate limit status, true if the request is allowed, false if the request is blocked
 */
export function checkRateLimit(ip: string): boolean {
	const count = rateLimiter.get(ip) || 0;

	if (count >= rateLimitOptions.max) {
		return false; // Block request
	}

	rateLimiter.set(ip, count + 1, { ttl: rateLimitOptions.ttl });
	return true; // Allow request
}

/**
 * Middleware for route protection and role-based access control.
 */
export async function middleware(req: ExtendedRequest) {
	const ip = req.headers.get("x-forwarded-for") || "unknown";

	if (req.nextUrl.pathname.startsWith("/api") && req.nextUrl.pathname !== "/api/logout") {
		if (!checkRateLimit(ip)) {
			return NextResponse.json({ response: "Too many requests, please try again later" }, { status: 429 });
		}
	}

	if (req.nextUrl.pathname.startsWith("/api")) {
		const token = req.cookies.get("access_token")?.value;
		if (!token) {
			req.user = { id: null, role: "guest" };
		} else {
			try {
				const payload = await verifyAccessToken(token);
				if (!payload) {
					req.user = { id: null, role: "guest" };
				} else {
					req.user = { id: payload.id, role: payload.role };
				}
			} catch (err) {
				req.user = { id: null, role: "guest" };
			}
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
