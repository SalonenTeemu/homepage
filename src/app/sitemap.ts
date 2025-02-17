import { MetadataRoute } from "next";

/**
 * Sitemap for the website.
 *
 * @returns {MetadataRoute.Sitemap} The sitemap
 */
export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: "https://salonenteemu.fi",
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 1,
		},
		{
			url: "https://salonenteemu.fi/resume",
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: "https://salonenteemu.fi/resume/resume.pdf",
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.5,
		},
		{
			url: "https://salonenteemu.fi/projects",
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: "https://salonenteemu.fi/projects/f1-race-schedule-app",
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.5,
		},
		{
			url: "https://salonenteemu.fi/projects/premier-league-app",
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.5,
		},
		{
			url: "https://salonenteemu.fi/projects/ai-chatbot-app",
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.5,
		},
		{
			url: "https://salonenteemu.fi/projects/ai-chess-app",
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.5,
		},
		{
			url: "https://salonenteemu.fi/register",
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: "https://salonenteemu.fi/login",
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: "https://salonenteemu.fi/profile",
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: "https://salonenteemu.fi/forgot-password",
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.5,
		},
	];
}
