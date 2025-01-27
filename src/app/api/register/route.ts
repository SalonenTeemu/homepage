import bcrypt from "bcrypt";
import { saveUserToDynamoDB } from "@/app/lib/userService";
import {
  isUsernameValid,
  isPasswordValid,
  isEmailValid,
  usernameMinLength,
  passwordMinLength,
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
        response: `Username must be at least ${usernameMinLength} characters, include at least one uppercase letter, and at least one number.`,
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
    saveUserToDynamoDB({ username, email, password: hashedPassword });

    return new Response(
      JSON.stringify({ response: "User registered successfully" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ response: "Registration failed" }), {
      status: 500,
    });
  }
}
