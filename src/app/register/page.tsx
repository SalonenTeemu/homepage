import CustomCursor from "@/app/components/common/customCursor";
import Navbar from "@/app/components/common/navbar";
import ScrollTopButton from "@/app/components/common/scrollTopButton";
import Register from "@/app/components/register/register";
import Footer from "../components/common/footer";
import { inter } from "@/app/components/common/fonts";

/**
 * The register page.
 *
 * @returns {JSX.Element} The register page
 */
export default function LoginPage() {
	return (
		<main className="relative min-h-screen w-full scroll-smooth bg-slate-950 text-slate-50 selection:bg-lime-500">
			<CustomCursor />
			<Navbar />
			<div className={`flex h-full w-full flex-col items-center justify-between ${inter.variable} font-inter`}>
				<Register />
				<ScrollTopButton />
				<Footer />
			</div>
		</main>
	);
}
