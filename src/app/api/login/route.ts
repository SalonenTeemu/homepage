import bcrypt from "bcrypt";
import { isUsernameValid, isPasswordValid } from "@/app/utils/utils";

/**
 * Responds to a POST request to login a user.
 *
 * @param req the request object
 * @returns {Response} the response object
 */
export async function POST(req: Request) {
  const body = await req.json();
  const { username, password } = body;

  if (!username || !isUsernameValid(username)) {
    return new Response(JSON.stringify({ response: "Invalid username" }), {
      status: 400,
    });
  }
  if (!password || !isPasswordValid(password)) {
    return new Response(JSON.stringify({ response: "Invalid password" }), {
      status: 400,
    });
  }

  try {
    /*const user = await getUserByUsername(username);
    if (!user) {
      return new Response(JSON.stringify({ response: "User not found" }), {
        status: 400,
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return new Response(JSON.stringify({ response: "Invalid password" }), {
        status: 400,
      });
    } */
    return new Response(JSON.stringify({ response: "Login successful" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ response: "Login failed" }), {
      status: 500,
    });
  }
}
