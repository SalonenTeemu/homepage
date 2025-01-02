import CustomCursor from "@/app/components/common/customCursor";
import Navbar from "@/app/components/navbar/navbar";
import ScrollTopButton from "@/app/components/common/scrollTopButton";
import Projects from "@/app/components/projects/projects";
import Footer from "../components/common/footer";
import { inter } from "@/app/components/common/fonts";

/**
 * The projects page.
 *
 * @returns {JSX.Element} The projects page
 */
export default function ProjectsPage() {
  return (
    <main className="w-full min-h-screen relative bg-slate-950 text-slate-50 selection:bg-lime-500 scroll-smooth">
      <CustomCursor />
      <Navbar />
      <div
        className={`w-full h-full flex flex-col items-center justify-between ${inter.variable} font-inter`}
      >
        <Projects />
        <ScrollTopButton />
        <Footer />
      </div>
    </main>
  );
}
