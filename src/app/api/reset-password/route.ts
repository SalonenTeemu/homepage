import bcrypt from "bcrypt";
import { isPasswordValid, passwordMinLength } from "@/app/utils/utils";
import { verifyToken } from "@/app/lib/services/authService";
import { updateUserById } from "@/app/lib/services/userService";
import logger from "@/app/lib/logger";

/**
 * Responds to a POST request to reset a user's password.
 *
 * @param req the request object
 * @returns {Response} the response object
 */
export async function POST(req: Request) {
	const { password, token } = await req.json();

	if (!password || !token) {
		return new Response("Password and token are required.", { status: 400 });
	}

	if (!isPasswordValid(password)) {
		logger.warn(`Password reset: Invalid password`);
		return new Response(
			JSON.stringify({
				response: `Password must be at least ${passwordMinLength} characters, include at least one uppercase letter, and at least one number.`,
			}),
			{ status: 400 }
		);
	}
	try {
		const decoded = await verifyToken(token);
		if (!decoded) {
			logger.warn(`Password reset: Invalid or expired token '${token}'`);
			return new Response(JSON.stringify({ response: "Invalid or expired token" }), {
				status: 403,
			});
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		await updateUserById(decoded.id, { hashedPassword });
		logger.info(`Password reset: Password updated for user with ID '${decoded.id}'`);
		return new Response(JSON.stringify({ response: "Password updated successfully" }), {
			status: 200,
		});
	} catch (error) {
		logger.error(`Password reset: ${error}`);
		return new Response(JSON.stringify({ response: "Error updating password" }), { status: 500 });
	}
}
