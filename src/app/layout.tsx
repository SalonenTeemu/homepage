import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter } from "next/font/google";
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
    "Homepage",
    "Developer",
    "Finland",
    "Tampere",
    "Suomi",
    "Resume",
    "Projects",
    "Premier League application",
    "F1 App",
    "AI chatbot App",
    "AI chess App",
    "Teemu Salonen Homepage",
    "Teemu Salonen Resume",
    "Teemu Salonen Projects",
    "Teemu Salonen LinkedIn",
    "Teemu Salonen GitHub",
  ],
  authors: [{ name: "Teemu Salonen", url: "https://salonenteemu.fi" }],
  creator: "Teemu Salonen",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
