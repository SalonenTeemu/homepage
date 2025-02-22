import { createToken } from "@/app/lib/services/authService";
import { sendResetPasswordEmail } from "@/app/lib/services/emailService";
import { getUserByEmail } from "@/app/lib/services/userService";
import { isEmailValid } from "@/app/utils/utils";
import logger from "@/app/lib/logger";

/**
 * Responds to a POST request to send a password reset email.
 *
 * @param req the request object
 * @returns {Response} the response object
 */
export async function POST(req: Request) {
	const { email } = await req.json();

	if (!email || email == undefined || !isEmailValid(email)) {
		logger.warn("Forgot password: Invalid email address");
		return new Response(JSON.stringify({ response: "Invalid email address" }), {
			status: 400,
		});
	}
	try {
		const user = await getUserByEmail(email);
		if (!user) {
			logger.warn(`Forgot password: No users associated with email '${email}'`);
			return new Response(JSON.stringify({ response: "No users associated with this email" }), {
				status: 404,
			});
		}
		if (!user.emailConfirmed) {
			logger.warn(`Forgot password: Email not confirmed for user with email '${email}'`);
			return new Response(JSON.stringify({ response: "Email not confirmed" }), {
				status: 400,
			});
		}
		const token = await createToken(user.id, "10m");
		if (!token) {
			logger.error("Forgot password: Failed creating token");
			return new Response(JSON.stringify({ response: "Failed creating token" }), {
				status: 500,
			});
		}
		await sendResetPasswordEmail(email, token);
		logger.info(`Forgot password: Password reset email sent to '${email}'`);
		return new Response(JSON.stringify({ response: "Password reset email sent" }), {
			status: 200,
		});
	} catch (err) {
		logger.error("Forgot password: Error sending password reset email:", err);
		return new Response(JSON.stringify({ response: "Sending password reset email failed" }), {
			status: 500,
		});
	}
}
