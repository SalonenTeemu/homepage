import { verifyAccessToken } from "@/app/lib/services/authService";

/**
 * Helper function to fetch again if access token is expired and to handle rate limit exceedance.
 *
 * @param url The URL to fetch
 * @param options The fetch options
 * @param logout The logout function
 * @param addNotification The notification function
 * @param router The router object
 * @returns The fetch response
 */
export async function fetchWithAuth(
	url: string,
	options = {},
	logout: () => void,
	addNotification: (type: "success" | "error" | "info", message: string) => void
) {
	let res = await fetch(url, { ...options, credentials: "include" });

	// Handle rate limit exceedance
	if (res.status === 429) {
		if (addNotification) addNotification("info", "Too many requests, please try again later.");
		return null;
	}

	// If request fails due to an expired access token (401)
	if (res.status === 401 || res.status === 403) {
		// Try to refresh the token
		const refreshRes = await fetch("/api/auth/refresh", {
			method: "POST",
			credentials: "include",
		});

		if (!refreshRes.ok) {
			logout();
			return null;
		}

		// Retry the original request with the new token
		return await fetch(url, { ...options, credentials: "include" });
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
