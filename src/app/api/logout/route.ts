import { cookies } from "next/headers";
import { createRevokedHeaderCookies } from "@/app/lib/services/authService";
import { deleteRefreshToken } from "@/app/lib/services/tokenService";

/**
 * Responds to a POST request to log out the user.
 *
 * @returns {Response} the response object
 */
export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token");

  try {
    if (refreshToken) {
      await deleteRefreshToken(refreshToken.value);
    }

    const headers = createRevokedHeaderCookies();
    return new Response(
      JSON.stringify({ response: "Logged out successfully" }),
      {
        status: 200,
        headers: headers,
      }
    );
  } catch (error) {
    console.log("Logout failed:", error);
    return new Response(JSON.stringify({ response: "Logout failed" }), {
      status: 500,
    });
  }
}
