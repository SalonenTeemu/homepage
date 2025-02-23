import type { Metadata } from "next";
import Navbar from "@/app/components/common/navbar";
import CustomCursor from "@/app/components/common/customCursor";
import GoBackButton from "@/app/components/common/goBackButton";
import Footer from "@/app/components/common/footer";
import Drivers from "@/app/components/projects/f1-app/drivers";
import F1AppNavbar from "@/app/components/projects/f1-app/navbar";
import ScrollTopButton from "@/app/components/common/scrollTopButton";

export const metadata: Metadata = {
	title: "F1 App | Teemu Salonen",
};

/**
 * The DriversPage component.
 *
 * @returns {JSX.Element} DriversPage component
 */
export default function DriversPage() {
	return (
		<main className="relative min-h-screen w-full scroll-smooth bg-slate-950 text-slate-50 selection:bg-lime-500">
			<Navbar />
			<CustomCursor />
			<F1AppNavbar />
			<div className="container mx-auto p-4">
				<GoBackButton {...{ href: "/projects" }} />
				<Drivers />
				<ScrollTopButton />
				<Footer />
			</div>
		</main>
	);
}
