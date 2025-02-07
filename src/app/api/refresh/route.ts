import { cookies } from "next/headers";
import { verifyRefreshToken, createTokens, createHeaderCookies } from "@/app/lib/services/authService";
import { deleteRefreshToken } from "@/app/lib/services/tokenService";

/**
 * Responds to a POST request to refresh a user's access token.
 *
 * @returns {Response} the response object
 */
export async function POST() {
	const cookieStore = await cookies();
	const oldRefreshToken = cookieStore.get("refresh_token");

	if (!oldRefreshToken) {
		return new Response(JSON.stringify({ response: "No refresh token provided" }), {
			status: 401,
		});
	}

	try {
		const user = await verifyRefreshToken(oldRefreshToken.value);
		if (!user) {
			await deleteRefreshToken(oldRefreshToken.value);
			return new Response(JSON.stringify({ response: "Invalid or expired refresh token" }), {
				status: 403,
			});
		}

		const tokens = await createTokens(user);
		if (!tokens) {
			return new Response(JSON.stringify({ response: "Failed to create tokens" }), {
				status: 500,
			});
		}
		const { accessToken, refreshToken } = tokens;
		const headers = createHeaderCookies(accessToken, refreshToken);

		console.log("Tokens refreshed for user:", user.id);

		await deleteRefreshToken(oldRefreshToken.value);

		return new Response(JSON.stringify({ response: "Tokens refreshed" }), {
			status: 200,
			headers: headers,
		});
	} catch (error) {
		return new Response(JSON.stringify({ response: "Token refresh failed" }), {
			status: 500,
		});
	}
}
