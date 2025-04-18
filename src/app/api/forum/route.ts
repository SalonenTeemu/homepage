import { cookies } from "next/headers";
import { getUserById } from "@/app/lib/services/userService";
import { validateAccessToken } from "@/app/utils/apiUtils";
import { savePost, getPostById, getPosts, getReplies, updatePost, deletePost } from "@/app/lib/services/forumService";
import { maxPostLength, isPostValid } from "@/app/utils/utils";
import logger from "@/app/lib/logger";
import { checkPostRateLimit } from "@/app/utils/rateLimiting";

/**
 * Responds to a GET request to retrieve posts or replies.
 *
 * @param req the request object
 * @returns {Response} the response object
 */
export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const threadId = searchParams.get("threadId");
	const limit = parseInt(searchParams.get("limit") || "10", 10);
	const lastEvaluatedKey = searchParams.get("lastEvaluatedKey")
		? JSON.parse(searchParams.get("lastEvaluatedKey") as string)
		: undefined;

	try {
		if (threadId) {
			const { replies, lastEvaluatedKey: newLastEvaluatedKey } = await getReplies(
				threadId,
				limit,
				lastEvaluatedKey
			);
			logger.info(`Forum get: Replies retrieved for thread ID '${threadId}'`);
			return new Response(JSON.stringify({ replies: replies || [], lastEvaluatedKey: newLastEvaluatedKey }), {
				status: 200,
			});
		} else {
			const { posts, lastEvaluatedKey: newLastEvaluatedKey } = await getPosts(limit, lastEvaluatedKey);
			logger.info(`Forum get: Posts retrieved`);
			return new Response(JSON.stringify({ posts, lastEvaluatedKey: newLastEvaluatedKey }), { status: 200 });
		}
	} catch (err) {
		logger.error(`Forum get: Error retrieving posts or replies: ${err}`);
		return new Response(JSON.stringify({ response: "Failed to fetch posts or replies" }), { status: 500 });
	}
}

/**
 * Responds to a POST request to send a new post.
 *
 * @param req the request object
 * @returns the response object
 */
export async function POST(req: Request) {
	const cookieStore = await cookies();

	const { status, userToken, error } = await validateAccessToken(cookieStore);

	if (status !== 200) {
		logger.warn(`Forum post: ${error}`);
		return new Response(JSON.stringify({ response: error }), { status });
	}

	if (!checkPostRateLimit(userToken.id)) {
		logger.warn(`Forum post: Rate limit exceeded for user with ID '${userToken.id}'`);
		return new Response(
			JSON.stringify({ response: "Exceeded limit for posts per day. Please try again tomorrow" }),
			{
				status: 400,
			}
		);
	}
	try {
		const body = await req.json();
		const { content, threadId } = body;

		if (!isPostValid(content)) {
			logger.warn(`Forum post: Invalid post sent by user with ID '${userToken.id}'`);
			return new Response(
				JSON.stringify({ response: `Post must be between 1 and ${maxPostLength} characters` }),
				{
					status: 400,
				}
			);
		}

		const user = await getUserById(userToken.id);
		if (!user) {
			logger.warn(`Forum post: User with ID '${userToken.id}' not found`);
			return new Response(JSON.stringify({ response: "User not found" }), {
				status: 404,
			});
		}

		if (threadId) {
			const originalPost = await getPostById(threadId);
			logger.warn(`Forum post: Thread with ID '${threadId}' not found`);
			if (!originalPost) {
				return new Response(JSON.stringify({ response: "Thread not found" }), { status: 400 });
			}
		}

		const newPost = await savePost({
			userId: user.id,
			displayName: user.displayName,
			content,
			threadId: threadId || null,
		});

		logger.info(`Forum post: Post sent by user with ID '${user.id}'`);

		return new Response(JSON.stringify({ response: newPost }), { status: 200 });
	} catch (err) {
		logger.error(`Forum post: Error sending post: ${err}`);
		return new Response(JSON.stringify({ response: "Sending post failed" }), { status: 500 });
	}
}

/**
 * Responds to a PUT request to update a post.
 *
 * @param req the request object
 * @returns the response object
 */
export async function PUT(req: Request) {
	const cookieStore = await cookies();

	const { status, userToken, error } = await validateAccessToken(cookieStore);

	if (status !== 200) {
		logger.warn(`Forum put: ${error}`);
		return new Response(JSON.stringify({ response: error }), { status });
	}

	try {
		const body = await req.json();
		const { id, content } = body;

		const post = await getPostById(id);

		if (!isPostValid(content)) {
			logger.warn(`Forum put: Invalid post sent by user with ID '${userToken.id}'`);
			return new Response(
				JSON.stringify({ response: `Post must be between 1 and ${maxPostLength} characters` }),
				{
					status: 400,
				}
			);
		}

		if (!post) {
			logger.warn(`Forum put: Post with ID '${id}' not found`);
			return new Response(JSON.stringify({ response: "Post not found" }), { status: 400 });
		}

		if (post.userId !== userToken.id && userToken.role !== "admin") {
			logger.warn(`Forum put: User with ID '${userToken.id}' is not the post owner`);
			return new Response(JSON.stringify({ error: "Unauthorized to edit post" }), { status: 401 });
		}

		await updatePost(id, content);
		logger.info(`Forum put: Post with ID '${id}' updated by user with ID '${userToken.id}'`);

		return new Response(JSON.stringify({ response: "Post updated" }), { status: 200 });
	} catch (err) {
		logger.error(`Forum put: Error updating post: ${err}`);
		return new Response(JSON.stringify({ response: "Updating post failed" }), { status: 500 });
	}
}

/**
 * Responds to a DELETE request to delete a post.
 *
 * @param req the request object
 * @returns the response object
 */
export async function DELETE(req: Request) {
	const cookieStore = await cookies();

	const { status, userToken, error } = await validateAccessToken(cookieStore);

	if (status !== 200) {
		logger.warn(`Forum delete: ${error}`);
		return new Response(JSON.stringify({ response: error }), { status });
	}

	try {
		const body = await req.json();
		const { id } = body;

		const post = await getPostById(id);
		if (!post) {
			logger.warn(`Forum delete: Post with ID '${id}' not found`);
			return new Response(JSON.stringify({ response: "Post not found" }), { status: 400 });
		}

		if (post.userId !== userToken.id && userToken.role !== "admin") {
			logger.warn(`Forum delete: User with ID '${userToken.id}' is not the post owner`);
			return new Response(JSON.stringify({ response: "Unauthorized to delete post" }), { status: 401 });
		}

		await deletePost(id);
		logger.info(`Forum delete: Post with ID '${id}' deleted by user with ID '${userToken.id}'`);

		return new Response(JSON.stringify({ response: "Post deleted" }), { status: 200 });
	} catch (err) {
		logger.error(`Forum delete: Error deleting post: ${err}`);
		return new Response(JSON.stringify({ response: "Deleting post failed" }), { status: 500 });
	}
}
