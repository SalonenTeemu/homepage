import type { Metadata } from "next";
import CustomCursor from "@/app/components/common/customCursor";
import Navbar from "@/app/components/common/navbar";
import ScrollTopButton from "@/app/components/common/scrollTopButton";
import GoBackButton from "@/app/components/common/goBackButton";
import F1App from "@/app/components/projects/f1-app/f1App";
import F1AppNavbar from "@/app/components/projects/f1-app/navbar";
import Footer from "@/app/components/common/footer";
import { inter } from "@/app/components/common/fonts";

export const metadata: Metadata = {
	title: "F1 App | Teemu Salonen",
};

/**
 * The F1 App page.
 *
 * @returns {JSX.Element} The F1 App page
 */
export default function F1AppPage() {
	return (
		<main className="relative min-h-screen w-full scroll-smooth bg-slate-950 text-slate-50 selection:bg-lime-500">
			<Navbar />
			<CustomCursor />
			<F1AppNavbar />
			<div className={`flex h-full w-full flex-col items-center justify-between ${inter.variable} font-inter`}>
				<F1App />
				<GoBackButton {...{ href: "/projects" }} />
				<ScrollTopButton />
				<Footer />
			</div>
		</main>
	);
}
