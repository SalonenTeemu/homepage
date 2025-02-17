import bcrypt from "bcrypt";
import { createHeaderCookies, createTokens } from "../../lib/services/authService";
import { getUserByUsername, getUserByEmail } from "../../lib/services/userService";
import { isUsernameValid, isPasswordValid, isEmailValid } from "@/app/utils/utils";

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
		return new Response(JSON.stringify({ response: "Invalid username or email" }), {
			status: 400,
		});
	}

	if (!password || !isPasswordValid(password)) {
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
			return new Response(JSON.stringify({ response: "Invalid username or email" }), {
				status: 400,
			});
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return new Response(JSON.stringify({ response: "Invalid password" }), {
				status: 400,
			});
		}

		const tokens = await createTokens(user);
		if (!tokens) {
			return new Response(JSON.stringify({ response: "Token creation failed" }), {
				status: 500,
			});
		}
		const { accessToken, refreshToken } = tokens;
		const headers = createHeaderCookies(accessToken, refreshToken);

		return new Response(JSON.stringify({ response: "Login successful" }), {
			status: 200,
			headers: headers,
		});
	} catch (error) {
		return new Response(JSON.stringify({ response: "Login failed" }), {
			status: 500,
		});
	}
}
