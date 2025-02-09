import Navbar from "@/app/components/common/navbar";
import ScrollTopButton from "@/app/components/common/scrollTopButton";
import GoBackButton from "@/app/components/common/goBackButton";
import AIChessApp from "@/app/components/projects/ai-chess-app/aiChessApp";
import Footer from "@/app/components/common/footer";
import { inter } from "@/app/components/common/fonts";

/**
 * The AI chatbot app page.
 *
 * @returns {JSX.Element} The AI chatbot app page
 */
export default function AIChatbotAppPage() {
	return (
		<main className="relative min-h-screen w-full scroll-smooth bg-slate-950 text-slate-50 selection:bg-lime-500">
			<Navbar />
			<div className={`flex h-full w-full flex-col items-center justify-between ${inter.variable} font-inter`}>
				<AIChessApp />
				<GoBackButton />
				<ScrollTopButton />
				<Footer />
			</div>
		</main>
	);
}
