import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import {
	getUserById,
	updateUserById,
	deleteUserById,
	getUserByEmail,
	getUserByUsername,
} from "@/app/lib/services/userService";
import { isEmailValid, isPasswordValid, passwordMinLength } from "@/app/utils/utils";
import { validateAccessToken } from "@/app/utils/apiUtils";
import { sendConfirmationEmail } from "@/app/lib/services/emailService";
import { createToken } from "@/app/lib/services/authService";
import logger from "@/app/lib/logger";

/**
 * Responds to a GET request to retrieve user's data.
 *
 * @returns {Response} The response object
 */
export async function GET() {
	const cookieStore = await cookies();

	const { status, userToken, error } = await validateAccessToken(cookieStore);

	if (status !== 200) {
		logger.warn(`Profile fetch: ${error}`);
		return new Response(JSON.stringify({ response: error }), { status });
	}

	try {
		const user = await getUserById(userToken.id);

		if (!user) {
			logger.warn(`Profile fetch: User with ID '${userToken.id}' not found`);
			return new Response(JSON.stringify({ response: "User not found" }), {
				status: 404,
			});
		}
		logger.info(`Profile fetch: User data retrieved for user with ID '${user.id}'`);
		return new Response(
			JSON.stringify({
				username: user.username,
				displayName: user.displayName,
				email: user.email,
				role: user.role || "user",
				emailConfirmed: user.emailConfirmed || false,
			}),
			{
				status: 200,
			}
		);
	} catch (error) {
		logger.error(`Profile fetch: ${error}`);
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
		logger.warn(`Profile update: ${error}`);
		return new Response(JSON.stringify({ response: error }), { status });
	}

	const body = await req.json();
	const { email, password, username } = body;

	const lowercaseUsername = username.toLowerCase();

	if (password && !isPasswordValid(password)) {
		logger.warn(`Profile update: Invalid password for user with ID ${userToken.id}`);
		return new Response(
			JSON.stringify({
				response: `Password must be at least ${passwordMinLength} characters, include at least one uppercase letter, and at least one number.`,
			}),
			{ status: 400 }
		);
	}

	try {
		const user = await getUserById(userToken.id);
		if (!user) {
			logger.warn(`Profile update: User with ID ${userToken.id} not found`);
			return new Response(JSON.stringify({ response: "User not found" }), {
				status: 404,
			});
		}
		if (email && email != undefined) {
			if (!isEmailValid(email)) {
				logger.warn(`Profile update: Invalid email address for user with ID ${user.id}`);
				return new Response(JSON.stringify({ response: "Invalid email address" }), {
					status: 400,
				});
			}

			const userWithEmail = await getUserByEmail(email);
			if (userWithEmail && userWithEmail.id !== user.id) {
				logger.warn(`Profile update: Email address already taken for user with ID ${user.id}`);
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

		if (lowercaseUsername !== user.username) {
			const userWithUsername = await getUserByUsername(lowercaseUsername);
			if (userWithUsername) {
				logger.warn(`Profile update: Username already taken for user with ID ${user.id}`);
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
		if (email && email != undefined && email != user.email) {
			updatedUser = await updateUserById((await userToken).id, {
				email,
				hashedPassword,
				emailConfirmed: false,
				username: lowercaseUsername,
				displayName: username,
			});
		} else {
			updatedUser = await updateUserById((await userToken).id, {
				hashedPassword,
				username: lowercaseUsername,
				displayName: username,
			});
		}

		if (!updatedUser) {
			logger.error(`Profile update: Updating user failed for user with ID ${user.id}`);
			return new Response(JSON.stringify({ response: "Updating user failed" }), {
				status: 500,
			});
		}

		if (email && email != undefined && email != user.email) {
			const confirmationToken = await createToken(updatedUser.id, "1h");
			if (!confirmationToken) {
				logger.error(
					`Profile update: Email confirmation failed for user with ID ${user.id} and email ${email}`
				);
				return new Response(JSON.stringify({ response: "Email confirmation failed" }), {
					status: 500,
				});
			} else {
				await sendConfirmationEmail(updatedUser.email, confirmationToken);
			}
		}

		logger.info(`Profile update: User data updated for user with ID ${user.id}`);
		return new Response(
			JSON.stringify({
				username: updatedUser.username,
				displayName: updatedUser.displayName,
				email: updatedUser.email,
				role: updatedUser.role || "user",
			}),
			{
				status: 200,
			}
		);
	} catch (error) {
		logger.error(`Profile update: ${error}`);
		return new Response(JSON.stringify({ response: "Updating user failed" }), {
			status: 500,
		});
	}
}

/**
 * Responds to a DELETE request to delete user.
 *
 * @returns {Response} The response object
 */
export async function DELETE() {
	const cookieStore = await cookies();

	const { status, userToken, error } = await validateAccessToken(cookieStore);

	if (status !== 200) {
		logger.warn(`Profile delete: ${error}`);
		return new Response(JSON.stringify({ response: error }), { status });
	}

	try {
		const user = await getUserById(userToken.id);
		if (!user) {
			logger.warn(`Profile delete: User with ID ${userToken.id} not found`);
			return new Response(JSON.stringify({ response: "User not found" }), {
				status: 404,
			});
		}
		await deleteUserById(userToken.id);
		logger.info(`Profile delete: User deleted with ID ${user.id}`);
		return new Response(JSON.stringify({ response: "User deleted" }), {
			status: 200,
		});
	} catch (error) {
		logger.error(`Profile delete: ${error}`);
		return new Response(JSON.stringify({ response: "Deleting user failed" }), {
			status: 500,
		});
	}
}
