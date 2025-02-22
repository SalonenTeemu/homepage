import bcrypt from "bcrypt";
import { createHeaderCookies, createTokens } from "../../../lib/services/authService";
import { getUserByUsername, getUserByEmail } from "../../../lib/services/userService";
import { isUsernameValid, isPasswordValid, isEmailValid } from "@/app/utils/utils";
import logger from "@/app/lib/logger";

/**
 * Responds to a POST request to login a user.
 *
 * @param req the request object
 * @returns {Response} the response object
 */
export async function POST(req: Request) {
	const body = await req.json();

	const { usernameOrEmail, password } = body;

	if (!usernameOrEmail || (!isUsernameValid(usernameOrEmail) && !isEmailValid(usernameOrEmail))) {
		logger.warn(`Login: Invalid username or email '${usernameOrEmail}'`);
		return new Response(JSON.stringify({ response: "Invalid username or email" }), {
			status: 400,
		});
	}

	if (!password || !isPasswordValid(password)) {
		logger.warn(`Login: Invalid password for user with username or email '${usernameOrEmail}'`);
		return new Response(JSON.stringify({ response: "Invalid password" }), {
			status: 400,
		});
	}

	try {
		let user;
		if (isEmailValid(usernameOrEmail)) {
			user = await getUserByEmail(usernameOrEmail);
		} else {
			const lowercaseUsername = usernameOrEmail.toLowerCase();
			user = await getUserByUsername(lowercaseUsername);
		}

		if (!user) {
			logger.warn(`Login: No user found with username or email '${usernameOrEmail}'`);
			return new Response(JSON.stringify({ response: "Invalid username or email" }), {
				status: 400,
			});
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			logger.warn(`Login: Invalid password for user with username or email '${usernameOrEmail}'`);
			return new Response(JSON.stringify({ response: "Invalid password" }), {
				status: 400,
			});
		}

		const tokens = await createTokens(user);
		if (!tokens) {
			logger.error("Login: Failed creating tokens");
			return new Response(JSON.stringify({ response: "Token creation failed" }), {
				status: 500,
			});
		}
		const { accessToken, refreshToken } = tokens;
		const headers = createHeaderCookies(accessToken, refreshToken);

		logger.info(`Login: User with username or email '${usernameOrEmail}' logged in successfully`);
		return new Response(JSON.stringify({ response: "Login successful" }), {
			status: 200,
			headers: headers,
		});
	} catch (err) {
		logger.error("Login: Error logging in user:", err);
		return new Response(JSON.stringify({ response: "Login failed" }), {
			status: 500,
		});
	}
}
