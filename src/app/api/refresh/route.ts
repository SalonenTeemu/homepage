import { cookies } from "next/headers";
import { verifyRefreshToken, createTokens, createHeaderCookies } from "@/app/lib/services/authService";
import { deleteRefreshToken } from "@/app/lib/services/tokenService";
import { ExtendedRequest } from "@/middleware";
import logger from "@/app/lib/logger";

/**
 * Responds to a POST request to refresh a user's access token.
 *
 * @returns {Response} the response object
 */
export async function POST(req: ExtendedRequest) {
	const cookieStore = await cookies();
	const oldRefreshToken = cookieStore.get("refresh_token");

	const reqUser = req.user;

	if (!oldRefreshToken) {
		logger.warn(`Token refresh: No refresh token provided for user with ID ${reqUser.id}`);
		return new Response(JSON.stringify({ response: "No refresh token provided" }), {
			status: 401,
		});
	}

	try {
		const user = await verifyRefreshToken(oldRefreshToken.value);
		if (!user) {
			await deleteRefreshToken(oldRefreshToken.value);
			logger.warn(`Token refresh: Invalid or expired refresh token for user with ID ${reqUser.id}`);
			return new Response(JSON.stringify({ response: "Invalid or expired refresh token" }), {
				status: 403,
			});
		}

		const tokens = await createTokens(user);
		if (!tokens) {
			logger.error(`Token refresh: Failed to create tokens for user with ID ${user.id}`);
			return new Response(JSON.stringify({ response: "Failed to create tokens" }), {
				status: 500,
			});
		}
		const { accessToken, refreshToken } = tokens;
		const headers = createHeaderCookies(accessToken, refreshToken);

		await deleteRefreshToken(oldRefreshToken.value);

		logger.info(`Token refresh: Tokens refreshed for user with ID ${user.id}`);
		return new Response(JSON.stringify({ response: "Tokens refreshed" }), {
			status: 200,
			headers: headers,
		});
	} catch (error) {
		logger.error(`Token refresh: ${error}`);
		return new Response(JSON.stringify({ response: "Token refresh failed" }), {
			status: 500,
		});
	}
}
