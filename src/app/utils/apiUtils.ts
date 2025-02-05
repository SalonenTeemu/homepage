import { verifyAccessToken } from "@/app/lib/services/authService";

/**
 * Helper function to fetch again if access token is expired.
 *
 * @param url The URL to fetch
 * @param options The fetch options
 * @returns The fetch response
 */
export async function fetchWithAuth(url: string, options = {}) {
	let res = await fetch(url, { ...options, credentials: "include" });

	// If request fails due to an expired access token (401)
	if (res.status === 401 || res.status === 403) {
		console.log("Access token expired, attempting to refresh...");

		// Try to refresh the token
		const refreshRes = await fetch("/api/refresh", {
			method: "POST",
			credentials: "include",
		});

		if (!refreshRes.ok) {
			console.log("Refresh token expired or invalid.");
			return null; // Refresh token is also invalid → user must log in again
		}

		console.log("Access token refreshed! Retrying original request...");

		// Retry the original request with the new token
		res = await fetch(url, { ...options, credentials: "include" });
	}

	return res;
}

/**
 * Validates the access token from cookies and returns the user token.
 *
 * @returns {Promise<{ status: number, userToken?: any, error?: string }>}
 */
export async function validateAccessToken(cookieStore: any): Promise<{
	status: number;
	userToken?: any;
	error?: string;
}> {
	const accessToken = cookieStore.get("access_token");
	if (!accessToken) {
		return { status: 401, error: "No access token provided" };
	}

	try {
		const userToken = await verifyAccessToken(accessToken.value);
		if (!userToken) {
			return { status: 403, error: "Invalid or expired access token" };
		}
		return { status: 200, userToken };
	} catch (error) {
		return { status: 500, error: "Token validation failed" };
	}
}
