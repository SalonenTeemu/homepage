import { SignJWT, jwtVerify } from "jose";
import { serialize } from "cookie";
import { getRefreshTokenFromDB, storeRefreshToken, revokeRefreshToken } from "./tokenService";

const secret = process.env.JWT_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;
const expiration = process.env.ACCESS_TOKEN_EXPIRATION || "15m";
const refreshExpiration = process.env.REFRESH_TOKEN_EXPIRATION || "7d";
const isProduction = process.env.ENV == "development" ? false : true;

/**
 * Create JWT tokens for a given user.
 *
 * @param user The user object
 * @returns The access and refresh tokens, null if error
 */
export async function createTokens(user: any) {
	try {
		const accessToken = await new SignJWT({
			id: user.id,
			role: user.role,
		})
			.setExpirationTime(expiration)
			.setProtectedHeader({ alg: "HS256" })
			.sign(new TextEncoder().encode(secret));

		const refreshToken = await new SignJWT({
			id: user.id,
			role: user.role,
		})
			.setExpirationTime(refreshExpiration)
			.setProtectedHeader({ alg: "HS256" })
			.sign(new TextEncoder().encode(refreshSecret));

		await storeRefreshToken(user.id, refreshToken);

		return { accessToken, refreshToken };
	} catch {
		return null;
	}
}

/**
 * Create JWT token.
 *
 * @param username The id of the user
 * @param expirationTime The expiration time of the token
 * @returns The token, null if error
 */
export async function createToken(id: string, expirationTime: string = expiration) {
	try {
		const token = await new SignJWT({ id })
			.setExpirationTime(expirationTime)
			.setProtectedHeader({ alg: "HS256" })
			.sign(new TextEncoder().encode(secret));
		return token;
	} catch {
		return null;
	}
}

/**
 * Verify an access token.
 *
 * @param token The access token
 * @returns The user object if valid, null otherwise
 */
export async function verifyAccessToken(token: string) {
	try {
		// Verify the access token with jose
		const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
		if (!payload) {
			return null;
		}
		return payload as unknown as { id: string; role: string };
	} catch {
		return null;
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
		const { payload } = await jwtVerify(refreshToken, new TextEncoder().encode(refreshSecret));
		if (!payload) {
			return null;
		}

		// Check if refresh token exists in DB and is valid
		const tokenRecord = await getRefreshTokenFromDB(refreshToken);
		if (!tokenRecord || tokenRecord.is_revoked) {
			return null;
		}

		return payload as unknown as { id: string; role: string };
	} catch {
		return null;
	}
}

/**
 * Verify a token.
 *
 * @param token The token
 * @returns The id of the user if valid, null otherwise
 */
export async function verifyToken(token: string) {
	try {
		// Verify the access token with jose
		const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
		if (!payload) {
			return null;
		}
		return payload as unknown as { id: string };
	} catch {
		return null;
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
			maxAge: 15 * 60,
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
