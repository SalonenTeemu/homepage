import { cookies } from "next/headers";
import { sendConfirmationEmail } from "@/app/lib/services/emailService";
import { createEmailConfirmationToken } from "@/app/lib/services/authService";
import { getUserById } from "@/app/lib/services/userService";
import { validateAccessToken } from "@/app/utils/apiUtils";

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
		return new Response(JSON.stringify({ response: error }), {
			status,
		});
	}

	try {
		const user = await getUserById((await userToken).id);
		if (!user) {
			return new Response(JSON.stringify({ response: "User not found" }), {
				status: 404,
			});
		} else {
			if (user.emailConfirmed) {
				return new Response(JSON.stringify({ response: "Email already confirmed" }), {
					status: 400,
				});
			}
			const confirmationToken = await createEmailConfirmationToken(user.id);
			if (!confirmationToken) {
				return new Response(JSON.stringify({ response: "Email confirmation failed" }), {
					status: 500,
				});
			} else {
				await sendConfirmationEmail(user.email, confirmationToken);
			}
			return new Response(JSON.stringify({ response: "Email confirmation sent" }), {
				status: 200,
			});
		}
	} catch (error) {
		return new Response(JSON.stringify({ response: "Email confirmation failed" }), {
			status: 500,
		});
	}
}
