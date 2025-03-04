import React from "react";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter } from "next/font/google";
import { AuthProvider } from "./context/authContext";
import { NotificationProvider } from "./context/notificationContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

/**
 * Metadata for the website.
 */
export const metadata: Metadata = {
	title: "Teemu Salonen",
	description: "Homepage of Teemu Salonen",
	keywords: [
		"Teemu Salonen",
		"Salonen Teemu",
		"salonenteemu",
		"salonenteemu.fi",
		"salonenteemu.fi Login",
		"salonenteemu.fi Register",
		"salonenteemu.fi Profile",
		"Salonen Teemu Tampere",
		"Salonen Teemu Homepage",
		"Salonen Teemu Website",
		"Salonen Teemu Resume",
		"Salonen Teemu Projects",
		"Salonen Teemu Forum",
		"Salonen Teemu Chat Forum",
		"Salonen Teemu LinkedIn",
		"Salonen Teemu GitHub",
		"Teemu Salonen Tampere",
		"Teemu Salonen Homepage",
		"Teemu Salonen Website",
		"Teemu Salonen Resume",
		"Teemu Salonen Projects",
		"Teemu Salonen Forum",
		"Teemu Salonen Chat Forum",
		"Teemu Salonen LinkedIn",
		"Teemu Salonen GitHub",
		"Premier League standings and fixtures",
		"Premier League table",
		"Premier League matches",
		"EPL standings and fixtures",
		"EPL table",
		"EPL matches",
		"Formula 1 standings",
		"Forumula 1 driver standings",
		"Formula 1 constructor standings",
		"F1 standings",
		"AI chatbot App",
		"AI chatbot",
		"AI assistant",
		"AI chess App",
		"AI chess",
		"Chess vs AI",
		"AI chess engine",
		"Chess vs computer",
	],
	authors: [{ name: "Teemu Salonen", url: "https://salonenteemu.fi" }],
	creator: "Teemu Salonen",
	publisher: "Teemu Salonen",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<NotificationProvider>
					<AuthProvider>{children}</AuthProvider>
				</NotificationProvider>
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	);
}
