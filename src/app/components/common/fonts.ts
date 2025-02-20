import { Roboto, Inter } from "next/font/google";

/**
 * Google Font Roboto.
 */
export const roboto = Roboto({
	subsets: ["latin"],
	style: ["normal"],
	weight: ["400", "500", "700"],
	display: "swap",
	variable: "--font-roboto",
});

/**
 * Google Font Inter.
 */
export const inter = Inter({
	subsets: ["latin"],
	style: ["normal"],
	weight: ["400", "500", "600"],
	display: "swap",
	variable: "--font-inter",
});
