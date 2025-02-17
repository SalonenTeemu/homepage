import { v4 as uuidv4 } from "uuid";
import { PutCommand, GetCommand, QueryCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { ReturnValue } from "@aws-sdk/client-dynamodb";
import { ddbDocClient } from "../dynamoDbClient";

const tableName = process.env.AWS_USER_TABLE;

/**
 * Saves a user to DynamoDB.
 *
 * @param user The user object with username, optional email, and hashed password.
 */
export async function saveUserToDB(user: { username: string; displayName: string; email?: string; password: string }) {
	const sanitizedEmail = user.email && user.email.trim() !== "" ? user.email : undefined;
	const sanitizedUsername = user.username.toLowerCase();

	const params = {
		TableName: tableName,
		Item: {
			id: uuidv4(),
			username: sanitizedUsername,
			displayName: user.displayName,
			email: sanitizedEmail,
			emailConfirmed: false,
			role: "user",
			password: user.password,
			createdAt: new Date().toISOString(),
		},
	};

	try {
		await ddbDocClient.send(new PutCommand(params));
		console.log("User saved to database.");
	} catch (error) {
		console.error("Error saving user:", error);
		throw new Error("Could not save user to database.");
	}
}

/**
 * Retrieves a user by id.
 *
 * @param id The user's id
 * @returns The user object if found, otherwise null
 */
export async function getUserById(id: string) {
	const params = {
		TableName: tableName,
		Key: { id },
	};
	try {
		const result = await ddbDocClient.send(new GetCommand(params));

		if (result.Item) {
			return result.Item;
		}

		return null;
	} catch (error) {
		console.error("Error checking existing user:", error);
		throw new Error("Error querying user from database.");
	}
}

/**
 * Checks if a user already exists by username or email and returns the user object.
 *
 * @param username The user's username
 * @param email The user's email
 * @returns The user object if found, otherwise null
 */
export async function getUserByUsernameOrEmail(username: string, email?: string) {
	try {
		if (username) {
			return await getUserByUsername(username);
		}
		if (email) {
			return await getUserByEmail(email);
		}
		return null;
	} catch (error) {
		console.error("Error checking existing user:", error);
		throw new Error("Error querying user from database.");
	}
}

/**
 * Retrieves a user by username.
 *
 * @param username The user's username
 * @returns The user object if found, otherwise null
 */
export async function getUserByUsername(username: string) {
	const params = {
		TableName: tableName,
		IndexName: "username-index",
		KeyConditionExpression: "username = :username",
		ExpressionAttributeValues: {
			":username": username,
		},
	};
	try {
		const result = await ddbDocClient.send(new QueryCommand(params));

		if (result.Items && result.Items.length > 0) {
			return result.Items[0];
		}

		return null;
	} catch (error) {
		console.error("Error checking existing user:", error);
		throw new Error("Error querying user from database.");
	}
}

/**
 * Retrieves a user by email.
 *
 * @param email The user's email
 * @returns The user object if found, otherwise null
 */
export async function getUserByEmail(email: string) {
	const params = {
		TableName: tableName,
		IndexName: "email-index",
		KeyConditionExpression: "email = :email",
		ExpressionAttributeValues: {
			":email": email,
		},
	};
	try {
		const result = await ddbDocClient.send(new QueryCommand(params));

		if (result.Items && result.Items.length > 0) {
			return result.Items[0];
		}

		return null;
	} catch (error) {
		console.error("Error checking existing user:", error);
		throw new Error("Error querying user from database.");
	}
}

/**
 * Updates a user's email and/or password.
 *
 * @param username The user's username
 * @param updates The updates to apply to the user as an object with email and/or hashedPassword
 * @returns The updated user object
 */
export async function updateUserById(
	id: string,
	updates: {
		username?: string;
		displayName?: string;
		email?: string;
		hashedPassword?: string;
		emailConfirmed?: boolean;
	}
) {
	let updateExpression = "SET ";
	const expressionAttributeValues: Record<string, any> = {};
	const expressionAttributeNames: Record<string, any> = {};

	if (updates.username && updates.displayName) {
		const sanitizedUsername = updates.username.toLowerCase();
		updateExpression += "#username = :username, #displayName = :displayName, ";
		expressionAttributeValues[":username"] = sanitizedUsername;
		expressionAttributeValues[":displayName"] = updates.displayName;
		expressionAttributeNames["#username"] = "username";
		expressionAttributeNames["#displayName"] = "displayName";
	}

	if (updates.email) {
		updateExpression += "#email = :email, ";
		expressionAttributeValues[":email"] = updates.email;
		expressionAttributeNames["#email"] = "email";
	}

	if (updates.hashedPassword) {
		updateExpression += "#password = :password, ";
		expressionAttributeValues[":password"] = updates.hashedPassword;
		expressionAttributeNames["#password"] = "password";
	}

	if (updates.emailConfirmed !== undefined) {
		updateExpression += "#emailConfirmed = :emailConfirmed, ";
		expressionAttributeValues[":emailConfirmed"] = updates.emailConfirmed;
		expressionAttributeNames["#emailConfirmed"] = "emailConfirmed";
	}

	// Remove trailing comma and space
	updateExpression = updateExpression.replace(/, $/, "");

	try {
		if (!Object.keys(expressionAttributeValues).length) {
			throw new Error("No valid fields provided for update.");
		}

		const params = {
			TableName: tableName,
			Key: { id },
			UpdateExpression: updateExpression,
			ExpressionAttributeValues: expressionAttributeValues,
			ExpressionAttributeNames: expressionAttributeNames,
			ReturnValues: "ALL_NEW" as ReturnValue,
		};

		const result = await ddbDocClient.send(new UpdateCommand(params));
		return result.Attributes;
	} catch (error) {
		console.error("Error updating user:", error);
		throw new Error("Error updating user.");
	}
}

/**
 * Deletes a user by id.
 *
 * @param id The user's id
 */
export async function deleteUserById(id: string) {
	const params = {
		TableName: tableName,
		Key: { id },
	};
	try {
		await ddbDocClient.send(new DeleteCommand(params));
		console.log("User deleted from database.");
	} catch (error) {
		console.error("Error deleting user:", error);
		throw new Error("Error deleting user.");
	}
}
