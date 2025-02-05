import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import { getUserByUsernameOrEmail, updateUser } from "@/app/lib/services/userService";
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
		const user = await getUserByUsernameOrEmail((await userToken).username);

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
	const { email, password } = body;

	if (password && !isPasswordValid(password)) {
		return new Response(
			JSON.stringify({
				response: `Password must be at least ${passwordMinLength} characters, include at least one uppercase letter, and at least one number.`,
			}),
			{ status: 400 }
		);
	}

	try {
		const existingUser = await getUserByUsernameOrEmail((await userToken).username, email);
		if (email) {
			if (!isEmailValid(email)) {
				return new Response(JSON.stringify({ response: "Invalid email address" }), {
					status: 400,
				});
			}

			if (existingUser && existingUser.email === email && existingUser.username !== (await userToken).username) {
				return new Response(
					JSON.stringify({
						response: "User with the given email already exists",
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
		if (email && existingUser && email != existingUser.email) {
			updatedUser = await updateUser((await userToken).username, {
				email,
				hashedPassword,
				emailConfirmed: false,
			});
		} else {
			updatedUser = await updateUser((await userToken).username, {
				email,
				hashedPassword,
			});
		}

		if (!updatedUser) {
			return new Response(JSON.stringify({ response: "Updating user failed" }), {
				status: 500,
			});
		}

		if (existingUser && email != existingUser.email) {
			const confirmationToken = await createEmailConfirmationToken(updatedUser.username);
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
