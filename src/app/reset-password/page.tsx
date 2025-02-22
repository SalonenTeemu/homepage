import { Suspense } from "react";
import CustomCursor from "@/app/components/common/customCursor";
import Navbar from "@/app/components/common/navbar";
import ScrollTopButton from "@/app/components/common/scrollTopButton";
import GoBackButton from "../components/common/goBackButton";
import ResetPassword from "@/app/components/reset-password/resetPassword";
import Footer from "../components/common/footer";
import { inter } from "@/app/components/common/fonts";

/**
 * The reset password page.
 *
 * @returns {JSX.Element} The reset password page
 */
export default function ResetPasswordPage() {
	return (
		<main className="relative min-h-screen w-full scroll-smooth bg-slate-950 text-slate-50 selection:bg-lime-500">
			<CustomCursor />
			<Navbar />
			<div className={`flex h-full w-full flex-col items-center justify-between ${inter.variable} font-inter`}>
				<GoBackButton />
				<Suspense fallback={<p>Loading...</p>}>
					<ResetPassword />
				</Suspense>
				<ScrollTopButton />
				<Footer />
			</div>
		</main>
	);
}
