import bcrypt from "bcrypt";
import { saveUserToDB, getUserByUsernameOrEmail, getUserByUsername } from "@/app/lib/services/userService";
import { createToken } from "@/app/lib/services/authService";
import { sendConfirmationEmail } from "@/app/lib/services/emailService";
import {
	isUsernameValid,
	isPasswordValid,
	isEmailValid,
	usernameMinLength,
	passwordMinLength,
	usernameMaxLength,
} from "@/app/utils/utils";

if (!process.env.GOOGLE_RECAPTCHA_SECRET_KEY) {
	throw new Error("GOOGLE_RECAPTCHA_SECRET_KEY is not defined");
}

const secretKey = process.env.GOOGLE_RECAPTCHA_SECRET_KEY;

/**
 * Responds to a POST request to register a new user.
 *
 * @param req the request object
 * @returns {Response} the response object
 */
export async function POST(req: Request) {
	const body = await req.json();
	const { username, email, password, recaptcha } = body;

	if (!recaptcha) {
		return new Response(JSON.stringify({ response: "Invalid captcha" }), {
			status: 400,
		});
	}
	if (!username) {
		return new Response(JSON.stringify({ response: "Username is required" }), {
			status: 400,
		});
	}
	if (!password) {
		return new Response(JSON.stringify({ response: "Password is required" }), {
			status: 400,
		});
	}

	if (!isUsernameValid(username)) {
		return new Response(
			JSON.stringify({
				response: `Username must be at least ${usernameMinLength} characters and at most ${usernameMaxLength} characters.`,
			}),
			{ status: 400 }
		);
	}
	if (email && !isEmailValid(email)) {
		return new Response(JSON.stringify({ response: "Invalid email address" }), {
			status: 400,
		});
	}
	if (!isPasswordValid(password)) {
		return new Response(
			JSON.stringify({
				response: `Password must be at least ${passwordMinLength} characters, include at least one uppercase letter, and at least one number.`,
			}),
			{ status: 400 }
		);
	}

	const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptcha}`;

	try {
		const response = await fetch(verifyUrl, { method: "POST" });
		const data = await response.json();

		if (!data.success) {
			return new Response(JSON.stringify({ response: "Invalid captcha" }), {
				status: 400,
			});
		}

		const hashedPassword = bcrypt.hashSync(password, 10);

		const lowercaseUsername = username.toLowerCase();

		const existingUser = await getUserByUsernameOrEmail(lowercaseUsername, email);

		if (existingUser) {
			if (existingUser.username === lowercaseUsername) {
				return new Response(
					JSON.stringify({
						response: "Username taken",
					}),
					{
						status: 400,
					}
				);
			} else if (existingUser.email === email) {
				return new Response(
					JSON.stringify({
						response: "Email taken",
					}),
					{
						status: 400,
					}
				);
			}
		} else {
			saveUserToDB({ username: lowercaseUsername, displayName: username, email, password: hashedPassword });

			if (email) {
				const user = await getUserByUsername(lowercaseUsername);
				if (user) {
					const confirmationToken = await createToken(user.id, "1h");
					if (confirmationToken) await sendConfirmationEmail(email, confirmationToken);
					else {
						return new Response(JSON.stringify({ response: "Email confirmation failed" }), {
							status: 500,
						});
					}
				} else {
					return new Response(JSON.stringify({ response: "User not found" }), {
						status: 404,
					});
				}
			}
		}
		return new Response(JSON.stringify({ response: "User registered successfully" }), {
			status: 200,
		});
	} catch (error) {
		return new Response(JSON.stringify({ response: "Registration failed" }), {
			status: 500,
		});
	}
}
