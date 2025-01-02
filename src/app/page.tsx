import CustomCursor from "@/app/components/common/customCursor";
import Navbar from "./components/navbar/navbar";
import Introduction from "@/app/components/introduction/introduction";
import AboutMe from "@/app/components/about/aboutMe";
import ScrollTopButton from "@/app/components/common/scrollTopButton";
import Footer from "./components/common/footer";
import { inter } from "@/app/components/common/fonts";

/**
 * Home page of the website.
 *
 * @returns {JSX.Element} HomePage component
 */
export default function HomePage() {
  return (
    <main className="w-full min-h-screen relative bg-slate-950 text-slate-50 selection:bg-lime-500 scroll-smooth">
      <CustomCursor />
      <Navbar />
      <div
        className={`w-full h-full flex flex-col items-center justify-between ${inter.variable} font-inter`}>
        <Introduction />
        <AboutMe />
        <ScrollTopButton />
        <Footer />
      </div>
    </main>
  );
}
