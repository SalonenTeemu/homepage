"use client";

import React, { useState, useRef, useEffect } from "react";

/**
 * Format the response text from the AI to display in the chat.
 *
 * @param text The response text from the AI
 * @returns The formatted response as an array of JSX elements
 */
const formatResponse = (text: string): any => {
	const lines: string[] = text.split("\n");
	const formatted: JSX.Element[] = [];
	let inList = false;

	lines.forEach((line, index) => {
		const trimmedLine = line.trim();

		if (!trimmedLine) return;

		if (trimmedLine.startsWith("* ")) {
			if (!inList) {
				formatted.push(<ul key={`list-start-${index}`} className="list-disc"></ul>);
				inList = true;
			}

			const listItem = trimmedLine.slice(2).trim();
			formatted.push(
				<li key={index} className="mb-1 ml-4">
					{listItem
						.split(/(\*\*.*?\*\*)/)
						.map((part, i) =>
							part.startsWith("**") && part.endsWith("**") ? (
								<strong key={i}>{part.replace(/\*\*/g, "")}</strong>
							) : (
								part
							)
						)}
				</li>
			);
		} else {
			if (inList) {
				formatted.push(<ul key={`list-end-${index}`} />);
				inList = false;
			}

			formatted.push(
				<p key={index} className="mb-2">
					{trimmedLine
						.split(/(\*\*.*?\*\*)/)
						.map((part, i) =>
							part.startsWith("**") && part.endsWith("**") ? (
								<strong key={i}>{part.replace(/\*\*/g, "")}</strong>
							) : (
								part
							)
						)}
				</p>
			);
		}
	});

	if (inList) {
		formatted.push(<ul key="list-end-final" />);
	}

	return formatted;
};

/**
 * AIChatbotApp project component.
 *
 * @returns {JSX.Element} AIChatbotApp component
 */
export default function AIChatbotApp() {
	const [prompt, setPrompt] = useState("");
	const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
	const [loading, setLoading] = useState(false);
	const messageContainerRef = useRef<HTMLDivElement>(null);

	/**
	 * Handles the form submission to send a message to the AI.
	 */
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!prompt || loading) return;

		const userMessage = prompt;

		setMessages((prevMessages) => [...prevMessages, { sender: "user", text: userMessage }]);

		setLoading(true);
		try {
			const res = await fetch("/api/chatbot", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ prompt }),
			});

			const data = await res.json();
			if (!res.ok) {
				setMessages((prevMessages) => [...prevMessages, { sender: "ai", text: data.response }]);
			}
			const aiMessage = data.response;

			setMessages((prevMessages) => [...prevMessages, { sender: "ai", text: aiMessage }]);
			setPrompt("");
		} catch (err) {
			setMessages((prevMessages) => [...prevMessages, { sender: "ai", text: "An error occurred." }]);
		} finally {
			setLoading(false);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			handleSubmit(e);
		}
	};

	useEffect(() => {
		if (messageContainerRef.current) {
			messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
		}
	}, [messages]);

	return (
		<div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-50 selection:bg-lime-500">
			<div className="w-[800px] max-w-full rounded-lg border border-slate-700 bg-slate-800 p-6 shadow-lg">
				<h1 className="mb-4 text-center text-2xl font-semibold">Gemini AI Chatbot</h1>

				{messages.length > 0 && (
					<div
						className="mb-4 max-h-[400px] overflow-y-auto rounded-md border border-slate-700 bg-slate-900 p-4"
						ref={messageContainerRef}
					>
						{messages.map((msg, index) => (
							<div
								key={index}
								className={`mb-2 ${msg.sender === "user" ? "text-lime-500" : "text-slate-50"}`}
							>
								<strong>{msg.sender === "user" ? "You" : "Gemini"}:</strong>
								<div>{formatResponse(msg.text)}</div>
							</div>
						))}
					</div>
				)}

				<form onSubmit={handleSubmit}>
					<textarea
						className="w-full rounded-md border border-slate-700 bg-slate-900 p-3 text-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-500"
						placeholder="Message Gemini..."
						value={prompt}
						onChange={(e) => setPrompt(e.target.value)}
						rows={2}
						onKeyDown={handleKeyPress}
						disabled={loading}
					/>
					<button
						type="submit"
						className="mt-4 w-full rounded-lg bg-lime-500 p-3 font-semibold text-slate-950 transition-colors duration-200 hover:bg-lime-600"
						disabled={loading}
					>
						{loading ? "Generating..." : "Send"}
					</button>
				</form>
				<p className="mt-4 text-center text-sm text-slate-400">Do not give any personal information.</p>
			</div>
		</div>
	);
}
