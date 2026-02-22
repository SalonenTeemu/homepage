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
 * @returns {Response} the response object
 */
export async function POST(req: Request) {
	const body = await req.json();
	const prompt = body?.prompt;

	if (!prompt) {
		logger.warn("Chatbot: Prompt is required for generating AI content");
		return new Response("Prompt is required", { status: 400 });
	}

	try {
		const result = await model.generateContent(prompt);
		logger.info("Chatbot: Generated AI response successfully");
		return new Response(JSON.stringify({ response: result.response.text() }), {
			status: 200,
		});
	} catch (err) {
		logger.error("Chatbot: Error generating AI response:", err);
		return new Response("Error generating content", { status: 500 });
	}
}
