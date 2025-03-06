import { cookies } from "next/headers";
import { sendConfirmationEmail } from "@/app/lib/services/emailService";
import { createToken } from "@/app/lib/services/authService";
import { getUserById } from "@/app/lib/services/userService";
import { validateAccessToken } from "@/app/utils/projectsUtils/apiUtils";
import logger from "@/app/lib/logger";

/**
 * Responds to a POST request to resend a confirmation email.
 *
 * @param req the request object
 * @returns {Response} the response object
 */
export async function POST() {
	const cookieStore = await cookies();

	const { status, userToken, error } = await validateAccessToken(cookieStore);

	if (status !== 200) {
		logger.warn(`Resend confirmation email: ${error}`);
		return new Response(JSON.stringify({ response: error }), {
			status,
		});
	}

	try {
		const user = await getUserById(userToken.id);
		if (!user) {
			logger.warn(`Resend confirmation email: User with ID '${userToken.id}' not found`);
			return new Response(JSON.stringify({ response: "User not found" }), {
				status: 404,
			});
		} else {
			if (user.emailConfirmed) {
				logger.warn(`Resend confirmation email: Email already confirmed for user with ID '${user.id}'`);
				return new Response(JSON.stringify({ response: "Email already confirmed" }), {
					status: 400,
				});
			}
			const confirmationToken = await createToken(user.id, "1h");
			if (!confirmationToken) {
				logger.error(
					`Resend confirmation email: Failed to create confirmation token for user with ID '${user.id}'`
				);
				return new Response(JSON.stringify({ response: "Email confirmation failed" }), {
					status: 500,
				});
			} else {
				await sendConfirmationEmail(user.email, confirmationToken);
			}
			logger.info(
				`Resend confirmation email: Email confirmation sent for user with ID '${user.id}' and email '${user.email}'`
			);
			return new Response(JSON.stringify({ response: "Email confirmation sent" }), {
				status: 200,
			});
		}
	} catch (err) {
		logger.error(`Resend confirmation email: ${err}`);
		return new Response(JSON.stringify({ response: "Email confirmation failed" }), {
			status: 500,
		});
	}
}
