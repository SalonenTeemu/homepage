import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import { getUserById, getUserByUsernameOrEmail, updateUser } from "@/app/lib/services/userService";
import { isEmailValid, isPasswordValid, passwordMinLength } from "@/app/utils/utils";
import { validateAccessToken } from "@/app/utils/apiUtils";
import { sendConfirmationEmail } from "@/app/lib/services/emailService";
import { createEmailConfirmationToken } from "@/app/lib/services/authService";

/**
 * Responds to a GET request to retrieve user's data.
 *
 * @returns {Response} The response object
 */
export async function GET() {
	const cookieStore = await cookies();

	const { status, userToken, error } = await validateAccessToken(cookieStore);

	if (status !== 200) {
		return new Response(JSON.stringify({ response: error }), { status });
	}

	try {
		const user = await getUserById((await userToken).id);

		if (!user) {
			return new Response(JSON.stringify({ response: "User not found" }), {
				status: 404,
			});
		}
		return new Response(
			JSON.stringify({
				username: user.username,
				email: user.email,
				role: user.role || "user",
				emailConfirmed: user.emailConfirmed || false,
			}),
			{
				status: 200,
			}
		);
	} catch (error) {
		return new Response(JSON.stringify({ response: "User data retrieval failed" }), {
			status: 500,
		});
	}
}

/**
 * Responds to a PUT request to update user's data.
 *
 * @param req The request object
 * @returns {Response} The response object
 */
export async function PUT(req: Request) {
	const cookieStore = await cookies();

	const { status, userToken, error } = await validateAccessToken(cookieStore);

	if (status !== 200) {
		return new Response(JSON.stringify({ response: error }), { status });
	}

	const body = await req.json();
	const { email, password, username } = body;

	if (password && !isPasswordValid(password)) {
		return new Response(
			JSON.stringify({
				response: `Password must be at least ${passwordMinLength} characters, include at least one uppercase letter, and at least one number.`,
			}),
			{ status: 400 }
		);
	}

	try {
		const user = await getUserById((await userToken).id);
		if (!user) {
			return new Response(JSON.stringify({ response: "User not found" }), {
				status: 404,
			});
		}
		if (email) {
			if (!isEmailValid(email)) {
				return new Response(JSON.stringify({ response: "Invalid email address" }), {
					status: 400,
				});
			}

			const userWithEmail = await getUserByUsernameOrEmail(email);
			if (userWithEmail && userWithEmail.id !== user.id) {
				return new Response(
					JSON.stringify({
						response: "Email taken",
					}),
					{
						status: 400,
					}
				);
			}
		}

		if (username !== user.username) {
			const userWithUsername = await getUserByUsernameOrEmail(username);
			if (userWithUsername) {
				return new Response(
					JSON.stringify({
						response: "Username taken",
					}),
					{
						status: 400,
					}
				);
			}
		}

		let hashedPassword = undefined;
		if (password) {
			hashedPassword = bcrypt.hashSync(password, 10);
		}

		let updatedUser;
		if (email && email != user.email) {
			updatedUser = await updateUser((await userToken).id, {
				email,
				hashedPassword,
				emailConfirmed: false,
				username,
			});
		} else {
			updatedUser = await updateUser((await userToken).id, {
				hashedPassword,
				username,
			});
		}

		if (!updatedUser) {
			return new Response(JSON.stringify({ response: "Updating user failed" }), {
				status: 500,
			});
		}

		if (email != user.email) {
			const confirmationToken = await createEmailConfirmationToken(updatedUser.id);
			if (!confirmationToken) {
				return new Response(JSON.stringify({ response: "Email confirmation failed" }), {
					status: 500,
				});
			} else {
				await sendConfirmationEmail(updatedUser.email, confirmationToken);
			}
		}

		return new Response(
			JSON.stringify({
				username: updatedUser.username,
				email: updatedUser.email,
				role: updatedUser.role || "user",
			}),
			{
				status: 200,
			}
		);
	} catch (error) {
		return new Response(JSON.stringify({ response: "Updating user failed" }), {
			status: 500,
		});
	}
}
