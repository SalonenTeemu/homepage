import { cookies } from "next/headers";
import {
  verifyRefreshToken,
  createTokens,
  revokeUserRefreshToken,
  createHeaderCookies,
} from "@/app/lib/services/authService";

/**
 * Responds to a POST request to refresh a user's refresh token.
 *
 * @returns {Response} the response object
 */
export async function POST() {
  const cookieStore = await cookies();
  const oldRefreshToken = cookieStore.get("refresh_token");

  if (!oldRefreshToken) {
    return new Response(
      JSON.stringify({ response: "No refresh token provided" }),
      {
        status: 401,
      }
    );
  }

  try {
    const user = await verifyRefreshToken(oldRefreshToken.value);
    if (!user) {
      await revokeUserRefreshToken(oldRefreshToken.value);
      return new Response(
        JSON.stringify({ response: "Invalid or expired refresh token" }),
        {
          status: 403,
        }
      );
    }

    const { accessToken, refreshToken } = await createTokens(user);
    const headers = createHeaderCookies(accessToken, refreshToken);

    console.log("Token refreshed for user:", user.username);

    return new Response(JSON.stringify({ response: "Token refreshed" }), {
      status: 200,
      headers: headers,
    });
  } catch (error) {
    return new Response(JSON.stringify({ response: "Token refresh failed" }), {
      status: 500,
    });
  }
}
