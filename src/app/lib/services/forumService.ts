import { v4 as uuidv4 } from "uuid";
import { PutCommand, GetCommand, ScanCommand, DeleteCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ReturnValue } from "@aws-sdk/client-dynamodb";
import { ddbDocClient } from "../dynamoDbClient";
import logger from "../logger";

const tableName = process.env.AWS_FORUM_TABLE;

/**
 * Saves a post to DynamoDB.
 *
 * @param post The post object with userId, displayName, content, and optional threadId.
 */
export async function savePostToDB(post: { userId: string; displayName: string; content: string; threadId?: string }) {
	const params = {
		TableName: tableName,
		Item: {
			id: uuidv4(),
			userId: post.userId,
			displayName: post.displayName,
			content: post.content,
			threadId: post.threadId || "null",
			edited: false,
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

/**
 * Retrieves a post by id.
 *
 * @param id The post's id
 * @returns The post object if found, otherwise null
 */
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

/**
 * Retrieves posts from the database. If a threadId is provided, retrieves posts for that thread.
 *
 * @param threadId The thread id to retrieve posts for
 * @returns The posts for the thread
 */
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
		const posts = result.Items || [];

		const postsWithReplyCount = await Promise.all(
			posts.map(async (post) => {
				const replyParams = {
					TableName: tableName,
					FilterExpression: "threadId = :threadId",
					ExpressionAttributeValues: {
						":threadId": post.id,
					},
				};
				const replyResult = await ddbDocClient.send(new ScanCommand(replyParams));
				const replyCount = replyResult.Count || 0;
				return { ...post, replyCount };
			})
		);

		return postsWithReplyCount;
	} catch (err) {
		logger.error(`Forum service: Error retrieving posts from database: ${err}`);
		throw new Error("Could not retrieve posts from database.");
	}
}

/**
 * Updates a post in the database.
 *
 * @param id The post's id
 * @param content The new content for the post
 * @returns The updated post object
 */
export async function updatePost(id: string, content: string) {
	const params = {
		TableName: tableName,
		Key: { id },
		UpdateExpression: "SET content = :content, edited = :edited",
		ExpressionAttributeValues: {
			":content": content,
			":edited": true,
		},
		ReturnValues: "ALL_NEW" as ReturnValue,
	};

	try {
		const result = await ddbDocClient.send(new UpdateCommand(params));
		return result.Attributes;
	} catch (err) {
		logger.error(`Forum service: Error updating post in database: ${err}`);
		throw new Error("Could not update post in database.");
	}
}

/**
 * Deletes a post from the database.
 *
 * @param id The post's id
 */
export async function deletePost(id: string) {
	const params = {
		TableName: tableName,
		Key: { id },
	};

	// Fetch all replies associated with the post
	const replyParams = {
		TableName: tableName,
		FilterExpression: "threadId = :threadId",
		ExpressionAttributeValues: {
			":threadId": id,
		},
	};

	try {
		const replyResult = await ddbDocClient.send(new ScanCommand(replyParams));
		const replies = replyResult.Items || [];

		// Delete each reply
		for (const reply of replies) {
			const deleteReplyParams = {
				TableName: tableName,
				Key: { id: reply.id },
			};
			await ddbDocClient.send(new DeleteCommand(deleteReplyParams));
		}

		// Delete the original post
		await ddbDocClient.send(new DeleteCommand(params));
	} catch (err) {
		logger.error(`Forum service: Error deleting post and its replies from database: ${err}`);
		throw new Error("Could not delete post and its replies from database.");
	}
}
