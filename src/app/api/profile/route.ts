import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import { verifyAccessToken } from "@/app/lib/services/authService";
import {
  getUserByUsernameOrEmail,
  getUserByEmail,
  updateUser,
} from "@/app/lib/services/userService";
import {
  isEmailValid,
  isPasswordValid,
  passwordMinLength,
} from "@/app/utils/utils";

/**
 * Responds to a GET request to retrieve user's data.
 *
 * @returns {Response} The response object
 */
export async function GET() {
  const cookieStore = await cookies();
  const access_token = cookieStore.get("access_token");

  if (!access_token) {
    return new Response(JSON.stringify({ response: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const userToken = verifyAccessToken(access_token.value);
    if (!userToken) {
      return new Response(
        JSON.stringify({ response: "Invalid or expired access token" }),
        {
          status: 403,
        }
      );
    }

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
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ response: "User data retrieval failed" }),
      {
        status: 500,
      }
    );
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
  console.log(cookieStore);
  const access_token = cookieStore.get("access_token");

  if (!access_token) {
    return new Response(JSON.stringify({ response: "Unauthorized" }), {
      status: 401,
    });
  }

  const userToken = verifyAccessToken(access_token.value);
  if (!userToken) {
    return new Response(
      JSON.stringify({ response: "Invalid or expired access token" }),
      {
        status: 403,
      }
    );
  }

  const body = await req.json();
  const { email, password } = body;

  if (!password) {
    return new Response(JSON.stringify({ response: "Password is required" }), {
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

  if (email) {
    if (!isEmailValid(email)) {
      return new Response(
        JSON.stringify({ response: "Invalid email address" }),
        {
          status: 400,
        }
      );
    }
    const existingUser = await getUserByEmail(email);

    if (existingUser && existingUser.email === email) {
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

  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const updatedUser = await updateUser((await userToken).username, {
      email,
      hashedPassword,
    });

    if (!updatedUser) {
      return new Response(
        JSON.stringify({ response: "Updating user failed" }),
        {
          status: 500,
        }
      );
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
