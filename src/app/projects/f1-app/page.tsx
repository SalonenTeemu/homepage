import CustomCursor from "@/app/components/common/customCursor";
import Navbar from "@/app/components/navbar/navbar";
import ScrollTopButton from "@/app/components/common/scrollTopButton";
import GoBackButton from "@/app/components/projects/goBackButton";
import F1App from "@/app/components/projects/f1-app/f1App";
import F1AppNavbar from "@/app/components/projects/f1-app/navbar";
import Footer from "@/app/components/common/footer";
import { inter } from "@/app/components/common/fonts";

/**
 * The F1 App page.
 *
 * @returns {JSX.Element} The F1 App page
 */
export default function F1AppPage() {
  return (
    <main className="w-full min-h-screen relative bg-slate-950 text-slate-50 selection:bg-lime-500 scroll-smooth">
      <Navbar />
      <CustomCursor />
      <F1AppNavbar />
      <div
        className={`w-full h-full flex flex-col items-center justify-between ${inter.variable} font-inter`}>
        <F1App />
        <GoBackButton />
        <ScrollTopButton />
        <Footer />
      </div>
    </main>
  );
}
