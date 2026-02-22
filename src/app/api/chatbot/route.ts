import { GoogleGenerativeAI } from "@google/generative-ai";
import logger from "@/app/lib/logger";

if (!process.env.GENERATIVE_AI_API_KEY) {
	logger.error("GENERATIVE_AI_API_KEY is not defined");
	throw new Error("GENERATIVE_AI_API_KEY is not defined");
}

const genAI = new GoogleGenerativeAI(process.env.GENERATIVE_AI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

/**
 * Responds to a POST request to generate content using the AI model.
 *
 * @param req the request object
 * @returns {Response} the response object with a ReadableStream for streaming the AI response
 */
export async function POST(req: Request) {
	const body = await req.json();
	const prompt = body?.prompt;

	if (!prompt) {
		logger.warn("Chatbot: Prompt is required for generating AI content");
		return new Response("Prompt is required", { status: 400 });
	}

	try {
		// Create a ReadableStream for streaming response
		const stream = new ReadableStream({
			async start(controller) {
				// Gemini streaming API
				const responseStream = await model.generateContentStream(prompt);

				// Loop over streamed chunks
				for await (const chunk of responseStream.stream) {
					const text = chunk.text();
					if (text) {
						controller.enqueue(new TextEncoder().encode(text));
					}
				}

				controller.close();
			},
		});

		// Return the stream as a response
		return new Response(stream, {
			headers: {
				"Content-Type": "text/plain; charset=utf-8",
				"Cache-Control": "no-cache",
			},
		});
	} catch (err) {
		logger.error("Chatbot: Error generating AI response:", err);
		return new Response("Error generating content", { status: 500 });
	}
}
