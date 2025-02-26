import type { Metadata } from "next";
import CustomCursor from "@/app/components/common/customCursor";
import Navbar from "@/app/components/common/navbar";
import ScrollTopButton from "@/app/components/common/scrollTopButton";
import Forum from "@/app/components/forum/forum";
import GoBackButton from "@/app/components/common/goBackButton";
import Footer from "../components/common/footer";
import { inter } from "@/app/components/common/fonts";

export const metadata: Metadata = {
	title: "Forum | Teemu Salonen",
};

/**
 * The forum page.
 *
 * @returns {JSX.Element} The forum page
 */
export default function ForumPage() {
	return (
		<main className="relative min-h-screen w-full scroll-smooth bg-slate-950 text-slate-50 selection:bg-lime-500">
			<CustomCursor />
			<Navbar />
			<div className={`flex h-full w-full flex-col items-center justify-between ${inter.variable} font-inter`}>
				<Forum />
				<ScrollTopButton />
				<GoBackButton />
				<Footer />
			</div>
		</main>
	);
}
