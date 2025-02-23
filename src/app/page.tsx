import type { Metadata } from "next";
import CustomCursor from "@/app/components/common/customCursor";
import Navbar from "./components/common/navbar";
import Introduction from "@/app/components/introduction/introduction";
import Test from "@/app/components/introduction/test";
import ScrollTopButton from "@/app/components/common/scrollTopButton";
import Footer from "./components/common/footer";
import { inter } from "@/app/components/common/fonts";

export const metadata: Metadata = {
	title: "Home | Teemu Salonen",
};

/**
 * Home page of the website.
 *
 * @returns {JSX.Element} HomePage component
 */
export default function HomePage() {
	return (
		<main className="relative min-h-screen w-full scroll-smooth bg-slate-950 text-slate-50 selection:bg-lime-500">
			<CustomCursor />
			<Navbar />
			<div className={`flex h-full w-full flex-col items-center justify-between ${inter.variable} font-inter`}>
				<Test />
				<ScrollTopButton />
				<Footer />
			</div>
		</main>
	);
}
