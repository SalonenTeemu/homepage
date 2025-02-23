import type { Metadata } from "next";
import CustomCursor from "@/app/components/common/customCursor";
import Navbar from "@/app/components/common/navbar";
import ScrollTopButton from "@/app/components/common/scrollTopButton";
import GoBackButton from "@/app/components/common/goBackButton";
import Footer from "@/app/components/common/footer";
import Standings from "@/app/components/projects/premier-league-app/standings";
import PremAppNavbar from "@/app/components/projects/premier-league-app/navbar";

export const metadata: Metadata = {
	title: "Premier League App | Teemu Salonen",
};

/**
 * Home page of Premier League App project.
 *
 * @returns {JSX.Element} PremierLeagueAppPage component
 */
export default function PremierLeagueAppPage() {
	return (
		<main className="relative min-h-screen w-full scroll-smooth bg-slate-950 text-slate-50 selection:bg-lime-500">
			<Navbar />
			<CustomCursor />
			<PremAppNavbar />
			<div className="container mx-auto p-4">
				<Standings />
				<GoBackButton {...{ href: "/projects" }} />
				<ScrollTopButton />
				<Footer />
			</div>
		</main>
	);
}
