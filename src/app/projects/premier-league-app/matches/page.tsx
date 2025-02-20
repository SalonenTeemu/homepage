import CustomCursor from "@/app/components/common/customCursor";
import Navbar from "@/app/components/common/navbar";
import ScrollTopButton from "@/app/components/common/scrollTopButton";
import GoBackButton from "@/app/components/common/goBackButton";
import Footer from "@/app/components/common/footer";
import Matches from "@/app/components/projects/premier-league-app/matches";
import PremAppNavbar from "@/app/components/projects/premier-league-app/navbar";

/**
 * MatchesPage component of Premier League App.
 *
 * @returns {JSX.Element} MatchesPage component
 */
export default function MatchesPage() {
	return (
		<main className="relative min-h-screen w-full scroll-smooth bg-slate-950 text-slate-50 selection:bg-lime-500">
			<Navbar />
			<CustomCursor />
			<PremAppNavbar />
			<div className="container mx-auto p-4">
				<Matches />
				<GoBackButton {...{ href: "/projects" }} />
				<ScrollTopButton />
				<Footer />
			</div>
		</main>
	);
}
