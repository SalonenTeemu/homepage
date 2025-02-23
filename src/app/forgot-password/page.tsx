import type { Metadata } from "next";
import CustomCursor from "@/app/components/common/customCursor";
import Navbar from "@/app/components/common/navbar";
import ScrollTopButton from "@/app/components/common/scrollTopButton";
import ForgotPassword from "@/app/components/forgot-password/forgotPassword";
import GoBackButton from "@/app/components/common/goBackButton";
import Footer from "../components/common/footer";
import { inter } from "@/app/components/common/fonts";

export const metadata: Metadata = {
	title: "Forgot Password | Teemu Salonen",
};

/**
 * The forgot password page.
 *
 * @returns {JSX.Element} The forgot password page
 */
export default function ForgotPasswordPage() {
	return (
		<main className="relative min-h-screen w-full scroll-smooth bg-slate-950 text-slate-50 selection:bg-lime-500">
			<CustomCursor />
			<Navbar />
			<div className={`flex h-full w-full flex-col items-center justify-between ${inter.variable} font-inter`}>
				<ForgotPassword />
				<ScrollTopButton />
				<GoBackButton />
				<Footer />
			</div>
		</main>
	);
}
