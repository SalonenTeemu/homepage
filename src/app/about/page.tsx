import CustomCursor from "@/app/components/common/customCursor";
import Navbar from "@/app/components/common/navbar";
import ScrollTopButton from "@/app/components/common/scrollTopButton";
import AboutMe from "../components/about/aboutMe";
import Resume from "@/app/components/resume/resume";
import ResumePDFLink from "../components/resume/resumePDFLink";
import Footer from "../components/common/footer";
import { inter } from "@/app/components/common/fonts";

/**
 * The about me page.
 *
 * @returns {JSX.Element} The about me page
 */
export default function AboutPage() {
	return (
		<main className="relative min-h-screen w-full scroll-smooth bg-slate-950 text-slate-50 selection:bg-lime-500">
			<CustomCursor />
			<Navbar />
			<div className={`flex h-full w-full flex-col items-center justify-between ${inter.variable} font-inter`}>
				<AboutMe />
				<Resume />
				<ScrollTopButton />
				<ResumePDFLink linkText="View my full resume here." />
				<Footer />
			</div>
		</main>
	);
}
