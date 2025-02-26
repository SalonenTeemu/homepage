import { v4 as uuidv4 } from "uuid";
import { PutCommand, GetCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../dynamoDbClient";
import logger from "../logger";

const tableName = process.env.AWS_FORUM_TABLE;

export async function savePostToDB(message: {
	userId: string;
	displayName: string;
	content: string;
	threadId?: string;
}) {
	const params = {
		TableName: tableName,
		Item: {
			id: uuidv4(),
			userId: message.userId,
			displayName: message.displayName,
			content: message.content,
			threadId: message.threadId || "null",
			createdAt: new Date().toISOString(),
		},
	};

	try {
		await ddbDocClient.send(new PutCommand(params));
	} catch (err) {
		logger.error(`Forum service: Error saving post to database: ${err}`);
		throw new Error("Could not save post to database.");
	}
}

export async function getPostById(id: string) {
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
	} catch (err) {
		logger.error(`Forum service: Error retrieving post from database: ${err}`);
		throw new Error("Could not retrieve post from database.");
	}
}

export async function getPosts(threadId?: string) {
	let params;

	if (threadId) {
		params = {
			TableName: tableName,
			FilterExpression: "threadId = :threadId",
			ExpressionAttributeValues: {
				":threadId": threadId,
			},
		};
	} else {
		params = {
			TableName: tableName,
			FilterExpression: "threadId = :threadId",
			ExpressionAttributeValues: {
				":threadId": "null",
			},
		};
	}
	try {
		const result = await ddbDocClient.send(new ScanCommand(params));
		return result.Items || [];
	} catch (err) {
		logger.error(`Forum service: Error retrieving posts from database: ${err}`);
		throw new Error("Could not retrieve posts from database.");
	}
}
