import { PutCommand, QueryCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../dynamoDbClient";

const tableName = process.env.AWS_REFRESH_TOKEN_TABLE;

/**
 * Store a refresh token to the database.
 *
 * @param username The id of the user
 * @param refreshToken The refresh token
 */
export async function storeRefreshToken(id: string, refreshToken: string) {
	const expiration = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
	const params = {
		TableName: tableName,
		Item: {
			refreshToken,
			id,
			is_revoked: false,
			createdAt: Math.floor(Date.now() / 1000),
			expiresAt: expiration,
		},
	};
	try {
		await ddbDocClient.send(new PutCommand(params));
	} catch {
		throw new Error("Could not store refresh token.");
	}
}

/**
 * Retrieve a refresh token from the database.
 *
 * @param refreshToken The refresh token
 * @returns The refresh token object if found, otherwise null
 */
export async function getRefreshTokenFromDB(refreshToken: string) {
	const params = {
		TableName: tableName,
		KeyConditionExpression: "refreshToken = :refreshToken",
		ExpressionAttributeValues: {
			":refreshToken": refreshToken,
		},
	};
	try {
		const result = await ddbDocClient.send(new QueryCommand(params));
		return result.Items ? result.Items[0] : null;
	} catch {
		throw new Error("Could not get refresh token.");
	}
}

/**
 * Revoke a refresh token.
 *
 * @param refreshToken The refresh token
 */
export async function revokeRefreshToken(refreshToken: string) {
	const params = {
		TableName: tableName,
		Key: { refreshToken },
		UpdateExpression: "SET is_revoked = :revoked",
		ExpressionAttributeValues: {
			":revoked": true,
		},
	};
	try {
		await ddbDocClient.send(new UpdateCommand(params));
	} catch {
		throw new Error("Could not revoke refresh token.");
	}
}

/**
 * Delete a refresh token from the database.
 *
 * @param refreshToken The refresh token
 */
export async function deleteRefreshToken(refreshToken: string) {
	const params = {
		TableName: tableName,
		Key: { refreshToken },
	};
	try {
		await ddbDocClient.send(new DeleteCommand(params));
	} catch {
		throw new Error("Could not delete refresh token.");
	}
}
