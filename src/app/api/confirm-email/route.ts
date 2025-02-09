import { verifyToken } from "@/app/lib/services/authService";
import { getUserById, updateUserById } from "@/app/lib/services/userService";

/**
 * Responds to a GET request to confirm a user's email.
 *
 * @param req the request object
 * @returns {Response} the response object
 */
export async function GET(req: Request) {
	const url = new URL(req.url);
	const token = url.searchParams.get("token");

	if (!token) {
		return new Response(JSON.stringify({ response: "No token" }), {
			status: 400,
		});
	}
	try {
		const decoded = await verifyToken(token);
		if (!decoded) {
			return new Response(JSON.stringify({ response: "Invalid or expired token" }), {
				status: 403,
			});
		}

		const user = await getUserById(decoded.id);
		if (!user) {
			return new Response(JSON.stringify({ response: "User not found" }), {
				status: 404,
			});
		}
		await updateUserById(user.id, { emailConfirmed: true });

		return new Response(JSON.stringify({ response: "User email confirmed" }), {
			status: 200,
		});
	} catch (error) {
		return new Response(JSON.stringify({ response: "Email confirmation failed" }), {
			status: 500,
		});
	}
}
