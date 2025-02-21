import { cookies } from "next/headers";
import { createRevokedHeaderCookies, verifyRefreshToken } from "@/app/lib/services/authService";
import { deleteRefreshToken } from "@/app/lib/services/tokenService";
import logger from "@/app/lib/logger";

/**
 * Responds to a POST request to log out the user.
 *
 * @returns {Response} the response object
 */
export async function POST() {
	const cookieStore = await cookies();
	const refreshToken = cookieStore.get("refresh_token");
	let user;

	try {
		if (refreshToken) {
			user = await verifyRefreshToken(refreshToken.value);
			await deleteRefreshToken(refreshToken.value);
		}

		const headers = createRevokedHeaderCookies();
		logger.info(`Logout successful for user with ID '${user?.id}'`);
		return new Response(JSON.stringify({ response: "Logged out successfully" }), {
			status: 200,
			headers: headers,
		});
	} catch (err) {
		logger.error(`Logout failed: ${err}`);
		return new Response(JSON.stringify({ response: "Logout failed" }), {
			status: 500,
		});
	}
}
