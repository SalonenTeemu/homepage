import { createToken } from "@/app/lib/services/authService";
import { sendResetPasswordEmail } from "@/app/lib/services/emailService";
import { getUserByEmail } from "@/app/lib/services/userService";
import { isEmailValid } from "@/app/utils/utils";

/**
 * Responds to a POST request to send a password reset email.
 *
 * @param req the request object
 * @returns {Response} the response object
 */
export async function POST(req: Request) {
	const { email } = await req.json();

	if (!email || email == undefined || !isEmailValid(email)) {
		return new Response(JSON.stringify({ response: "Invalid email address" }), {
			status: 400,
		});
	}
	try {
		const user = await getUserByEmail(email);
		if (!user) {
			return new Response(JSON.stringify({ response: "No users associated with this email" }), {
				status: 404,
			});
		}
		if (!user.emailConfirmed) {
			return new Response(JSON.stringify({ response: "Email not confirmed" }), {
				status: 400,
			});
		}
		const token = await createToken(user.id, "10m");
		if (!token) {
			return new Response(JSON.stringify({ response: "Failed creating token" }), {
				status: 500,
			});
		}
		await sendResetPasswordEmail(email, token);
		return new Response(JSON.stringify({ response: "Password reset email sent" }), {
			status: 200,
		});
	} catch (error) {
		return new Response(JSON.stringify({ response: "Sending password reset email failed" }), {
			status: 500,
		});
	}
}
