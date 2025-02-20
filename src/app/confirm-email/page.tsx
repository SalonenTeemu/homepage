import CustomCursor from "@/app/components/common/customCursor";
import Navbar from "@/app/components/common/navbar";
import ConfirmEmail from "@/app/components/confirm-email/confirmEmail";
import ScrollTopButton from "@/app/components/common/scrollTopButton";
import Footer from "../components/common/footer";
import { inter } from "@/app/components/common/fonts";

/**
 * The confirm email page.
 *
 * @returns {JSX.Element} The confirm email page
 */
export default function ConfirmEmailPage() {
	return (
		<main className="relative min-h-screen w-full scroll-smooth bg-slate-950 text-slate-50 selection:bg-lime-500">
			<CustomCursor />
			<Navbar />
			<div className={`flex h-full w-full flex-col items-center justify-between ${inter.variable} font-inter`}>
				<ConfirmEmail />
				<ScrollTopButton />
				<Footer />
			</div>
		</main>
	);
}
