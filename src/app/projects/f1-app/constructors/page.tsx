import Navbar from "@/app/components/common/navbar";
import CustomCursor from "@/app/components/common/customCursor";
import GoBackButton from "@/app/components/common/goBackButton";
import Footer from "@/app/components/common/footer";
import Constructors from "@/app/components/projects/f1-app/constructors";
import F1AppNavbar from "@/app/components/projects/f1-app/navbar";
import ScrollTopButton from "@/app/components/common/scrollTopButton";

/**
 * The ConstructorsPage component.
 *
 * @returns {JSX.Element} ConstructorsPage component
 */
export default function ConstructorsPage() {
	return (
		<main className="relative min-h-screen w-full scroll-smooth bg-slate-950 text-slate-50 selection:bg-lime-500">
			<Navbar />
			<CustomCursor />
			<F1AppNavbar />
			<div className="container mx-auto p-4">
				<Constructors />
				<GoBackButton {...{ href: "/projects" }} />
				<ScrollTopButton />
				<Footer />
			</div>
		</main>
	);
}
