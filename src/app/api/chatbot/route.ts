import { GoogleGenAI } from "@google/genai";
import logger from "@/app/lib/logger";

if (!process.env.GENERATIVE_AI_API_KEY) {
	logger.error("GENERATIVE_AI_API_KEY is not defined");
	throw new Error("GENERATIVE_AI_API_KEY is not defined");
}

if (!process.env.GENERATIVE_AI_MODEL) {
	logger.error("GENERATIVE_AI_MODEL is not defined");
	throw new Error("GENERATIVE_AI_MODEL is not defined");
}

// Initialize the Google Generative AI client with the API key
const ai = new GoogleGenAI({
	apiKey: process.env.GENERATIVE_AI_API_KEY,
});

// Define the model to be used for generating content
const MODEL = process.env.GENERATIVE_AI_MODEL;

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
		const result = await ai.models.generateContent({
			model: MODEL,
			contents: prompt,
		});
		logger.info("Chatbot: Generated AI response successfully");
		return new Response(JSON.stringify({ response: result.text }), {
			status: 200,
		});
	} catch (err) {
		logger.error("Chatbot: Error generating AI response:", err);
		return new Response("Error generating content", { status: 500 });
	}
}
