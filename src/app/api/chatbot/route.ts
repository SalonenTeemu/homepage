import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GENERATIVE_AI_API_KEY) {
	throw new Error("GENERATIVE_AI_API_KEY is not defined");
}
const genAI = new GoogleGenerativeAI(process.env.GENERATIVE_AI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
		return new Response("Prompt is required", { status: 400 });
	}

	try {
		const result = await model.generateContent(prompt);
		return new Response(JSON.stringify({ response: result.response.text() }), {
			status: 200,
		});
	} catch (error) {
		console.error("Error generating AI response:", error);
		return new Response("Error generating content", { status: 500 });
	}
}
