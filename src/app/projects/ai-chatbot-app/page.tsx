import type { Metadata } from "next";
import CustomCursor from "@/app/components/common/customCursor";
import Navbar from "@/app/components/common/navbar";
import ScrollTopButton from "@/app/components/common/scrollTopButton";
import GoBackButton from "@/app/components/common/goBackButton";
import AIChatbotApp from "@/app/components/projects/ai-chatbot-app/aiChatbotApp";
import Footer from "@/app/components/common/footer";
import { inter } from "@/app/components/common/fonts";

export const metadata: Metadata = {
	title: "AI Chatbot App | Teemu Salonen",
};

/**
 * The AI chatbot app page.
 *
 * @returns {JSX.Element} The AI chatbot app page
 */
export default function AIChatbotAppPage() {
	return (
		<main className="relative min-h-screen w-full scroll-smooth bg-slate-950 text-slate-50 selection:bg-lime-500">
			<CustomCursor />
			<Navbar />
			<div className={`flex h-full w-full flex-col items-center justify-between ${inter.variable} font-inter`}>
				<AIChatbotApp />
				<GoBackButton {...{ href: "/projects" }} />
				<ScrollTopButton />
				<Footer />
			</div>
		</main>
	);
}
