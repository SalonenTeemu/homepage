import { cookies } from "next/headers";
import { getUserById } from "@/app/lib/services/userService";
import { validateAccessToken } from "@/app/utils/apiUtils";
import { savePostToDB, getPostById, getPosts } from "@/app/lib/services/forumService";
import logger from "@/app/lib/logger";

/**
 * Responds to a GET request to retrieve posts.
 *
 * @param req the request object
 * @returns {Response} the response object
 */
export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const threadId = searchParams.get("threadId");

	try {
		const posts = await getPosts(threadId || undefined);
		logger.info(`Forum get: Posts retrieved with thread ID '${threadId}'`);
		return new Response(JSON.stringify(posts), { status: 200 });
	} catch (err) {
		logger.error(`Forum get: Error retrieving posts: ${err}`);
		return new Response(JSON.stringify({ error: "Failed to fetch posts" }), { status: 500 });
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
	try {
		const body = await req.json();
		const { content, threadId } = body;

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
				return new Response(JSON.stringify({ error: "Thread not found" }), { status: 400 });
			}
		}

		await savePostToDB({
			userId: user.id,
			displayName: user.displayName,
			content,
			threadId: threadId || null,
		});

		logger.info(`Forum post: Post sent by user with ID '${user.id}'`);

		return new Response(JSON.stringify({ response: "Post saved" }), { status: 200 });
	} catch (err) {
		logger.error(`Forum post: Error sending post: ${err}`);
		return new Response(JSON.stringify({ response: "Sending post failed" }), { status: 500 });
	}
}
