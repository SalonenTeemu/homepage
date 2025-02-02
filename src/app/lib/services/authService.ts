import { SignJWT, jwtVerify } from "jose";
import { serialize } from "cookie";
import {
  getRefreshTokenFromDB,
  storeRefreshToken,
  revokeRefreshToken,
} from "./tokenService";
import { getUserByUsernameOrEmail } from "./userService";
import { User } from "../../types/authTypes";

const secret = process.env.JWT_SECRET;
const refreshSecret = process.env.REFRESH_SECRET;
const expiration = process.env.ACCESS_TOKEN_EXPIRATION || "15m";
const refreshExpiration = process.env.REFRESH_TOKEN_EXPIRATION || "7d";
const isProduction = process.env.ENV == "development" ? false : true;

/**
 * Create JWT tokens for a given user.
 *
 * @param user The user object
 * @returns The access and refresh tokens
 */
export async function createTokens(user: any) {
  try {
    const accessToken = await new SignJWT({
      username: user.username,
      role: user.role,
    })
      .setExpirationTime(expiration)
      .setProtectedHeader({ alg: "HS256" })
      .sign(new TextEncoder().encode(secret));

    const refreshToken = await new SignJWT({
      username: user.username,
      role: user.role,
    })
      .setExpirationTime(refreshExpiration)
      .setProtectedHeader({ alg: "HS256" })
      .sign(new TextEncoder().encode(refreshSecret));

    await storeRefreshToken(user.username, refreshToken);

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error creating tokens:", error);
    throw new Error("Error creating tokens");
  }
}

/**
 * Create JWT token for email confirmation.
 *
 * @param username The username to create the token for
 * @returns The email confirmation token
 */
export async function createEmailConfirmationToken(username: string) {
  try {
    const token = await new SignJWT({ username })
      .setExpirationTime("1h")
      .setProtectedHeader({ alg: "HS256" })
      .sign(new TextEncoder().encode(secret));
    return token;
  } catch (error) {
    console.error("Error creating email confirmation token:", error);
    throw new Error("Error creating email confirmation token");
  }
}

/**
 * Verify an access token.
 *
 * @param token The access token
 */
export async function verifyAccessToken(token: string) {
  try {
    // Verify the access token with jose
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );
    return payload as unknown as User;
  } catch (err) {
    throw new Error("Invalid access token");
  }
}

/**
 * Verify a refresh token.
 *
 * @param refreshToken The refresh token
 * @returns The user object if valid, null otherwise
 */
export async function verifyRefreshToken(refreshToken: string) {
  try {
    // Verify the refresh token with jose
    const { payload } = await jwtVerify(
      refreshToken,
      new TextEncoder().encode(refreshSecret)
    );

    // Check if refresh token exists in DB and is valid
    const tokenRecord = await getRefreshTokenFromDB(refreshToken);
    if (!tokenRecord || tokenRecord.is_revoked) {
      return null;
    }

    // Retrieve user from DB based on the decoded refresh token payload
    const user = await getUserByUsernameOrEmail((payload as any).username);
    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error("Refresh token verification failed:", error);
    return null;
  }
}

export async function verifyConfirmEmailToken(token: string) {
  try {
    // Verify the access token with jose
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );
    return payload as unknown as { username: string };
  } catch (err) {
    throw new Error("Invalid access token");
  }
}

/**
 * Revoke a refresh token.
 *
 * @param refreshToken The refresh token to revoke
 */
export async function revokeUserRefreshToken(refreshToken: string) {
  await revokeRefreshToken(refreshToken);
}

/**
 * Create headers with cookies set for the access and refresh tokens.
 *
 * @param accessToken The access token
 * @param refreshToken The refresh token
 * @returns The headers object with the cookies set.
 */
export function createHeaderCookies(accessToken: string, refreshToken: string) {
  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    serialize("access_token", accessToken, {
      httpOnly: true,
      path: "/",
      secure: isProduction,
      sameSite: "strict",
      maxAge: 5 * 60,
    })
  );
  headers.append(
    "Set-Cookie",
    serialize("refresh_token", refreshToken, {
      httpOnly: true,
      path: "/",
      secure: isProduction,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
    })
  );
  return headers;
}

/**
 * Create headers with cookies revoked for the access and refresh tokens.
 *
 * @returns The headers object with the cookies revoked.
 */
export function createRevokedHeaderCookies() {
  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    serialize("access_token", "", {
      httpOnly: true,
      path: "/",
      secure: isProduction,
      sameSite: "strict",
      maxAge: 0,
    })
  );
  headers.append(
    "Set-Cookie",
    serialize("refresh_token", "", {
      httpOnly: true,
      path: "/",
      secure: isProduction,
      sameSite: "strict",
      maxAge: 0,
    })
  );
  return headers;
}
