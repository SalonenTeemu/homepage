import CustomCursor from "@/app/components/common/customCursor";
import Navbar from "@/app/components/common/navbar";
import ScrollTopButton from "@/app/components/common/scrollTopButton";
import GoBackButton from "@/app/components/projects/goBackButton";
import F1RaceScheduleApp from "@/app/components/projects/f1-race-schedule-app/f1RaceScheduleApp";
import Footer from "@/app/components/common/footer";
import { inter } from "@/app/components/common/fonts";

/**
 * The F1 Race Schedule App page.
 *
 * @returns {JSX.Element} The F1 Race Schedule App page
 */
export default function F1RaceScheduleAppPage() {
	return (
		<main className="relative min-h-screen w-full scroll-smooth bg-slate-950 text-slate-50 selection:bg-lime-500">
			<CustomCursor />
			<Navbar />
			<div className={`flex h-full w-full flex-col items-center justify-between ${inter.variable} font-inter`}>
				<F1RaceScheduleApp />
				<GoBackButton />
				<ScrollTopButton />
				<Footer />
			</div>
		</main>
	);
}
