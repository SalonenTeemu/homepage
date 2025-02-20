import { cookies } from "next/headers";
import { createRevokedHeaderCookies } from "@/app/lib/services/authService";
import { deleteRefreshToken } from "@/app/lib/services/tokenService";
import { ExtendedRequest } from "@/middleware";
import logger from "@/app/lib/logger";

/**
 * Responds to a POST request to log out the user.
 *
 * @returns {Response} the response object
 */
export async function POST(req: ExtendedRequest): Promise<Response> {
	const cookieStore = await cookies();
	const refreshToken = cookieStore.get("refresh_token");

	const user = req.user;

	try {
		if (refreshToken) {
			await deleteRefreshToken(refreshToken.value);
		}

		const headers = createRevokedHeaderCookies();
		logger.info(`Logout: User with ID ${user.id} logged out`);
		return new Response(JSON.stringify({ response: "Logged out successfully" }), {
			status: 200,
			headers: headers,
		});
	} catch (error) {
		logger.error(`Logout: User with ID ${user.id} failed to log out: ${error}`);
		return new Response(JSON.stringify({ response: "Logout failed" }), {
			status: 500,
		});
	}
}
