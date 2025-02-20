import Navbar from "@/app/components/common/navbar";
import ScrollTopButton from "@/app/components/common/scrollTopButton";
import GoBackButton from "@/app/components/common/goBackButton";
import AIChessApp from "@/app/components/projects/ai-chess-app/aiChessApp";
import Footer from "@/app/components/common/footer";
import { inter } from "@/app/components/common/fonts";

/**
 * The AI chess app page.
 *
 * @returns {JSX.Element} The AI chess app page
 */
export default function AIChessAppPage() {
	return (
		<main className="relative min-h-screen w-full scroll-smooth bg-slate-950 text-slate-50 selection:bg-lime-500">
			<Navbar />
			<div className={`flex h-full w-full flex-col items-center justify-between ${inter.variable} font-inter`}>
				<AIChessApp />
				<GoBackButton {...{ href: "/projects" }} />
				<ScrollTopButton />
				<Footer />
			</div>
		</main>
	);
}
