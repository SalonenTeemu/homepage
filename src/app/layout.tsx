import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Teemu Salonen",
  description: "Homepage of Teemu Salonen",
  keywords: [
    "Teemu Salonen",
    "Salonen Teemu",
    "Homepage",
    "Developer",
    "Software Developer",
    "Full stack developer",
    "Full stack",
    "Web developer",
    "Backend developer",
    "Finland",
    "Next.js",
    "React",
    "TypeScript",
    "Tampere University",
    "TUNI",
    "Tampere",
    "Tampereen yliopisto",
    "Suomi",
    "Ohjelmistokehittäjä",
    "Teemu Salonen Homepage",
    "Teemu Salonen Developer",
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
