import CustomCursor from "@/app/components/common/customCursor";
import Navbar from "@/app/components/navbar/navbar";
import ScrollTopButton from "@/app/components/common/scrollTopButton";
import Resume from "@/app/components/resume/resume";
import ResumePDFLink from "../components/resume/resumePDFLink";
import FooterText from "../components/common/footerText";
import { inter } from "@/app/components/common/fonts";

/**
 * The resume page.
 *
 * @returns {JSX.Element} The resume page
 */
export default function ResumePage() {
  return (
    <main className="w-full min-h-screen relative bg-slate-950 text-slate-50 selection:bg-lime-500 scroll-smooth">
      <CustomCursor />
      <Navbar />
      <div
        className={`w-full h-full flex flex-col items-center justify-between ${inter.variable} font-inter`}
      >
        <Resume />
        <ScrollTopButton />
        <ResumePDFLink />
        <FooterText />
      </div>
    </main>
  );
}
