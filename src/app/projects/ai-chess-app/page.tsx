import CustomCursor from "@/app/components/common/customCursor";
import Navbar from "@/app/components/navbar/navbar";
import ScrollTopButton from "@/app/components/common/scrollTopButton";
import GoBackButton from "@/app/components/projects/goBackButton";
import AIChessApp from "@/app/components/projects/ai-chess-app/aiChessApp";
import Footer from "@/app/components/common/footer";
import { inter } from "@/app/components/common/fonts";

/**
 * The AI chatbot app page.
 *
 * @returns {JSX.Element} The AI chatbot app page
 */
export default function AIChatbotAppPage() {
  return (
    <main className="w-full min-h-screen relative bg-slate-950 text-slate-50 selection:bg-lime-500 scroll-smooth">
      <Navbar />
      <div
        className={`w-full h-full flex flex-col items-center justify-between ${inter.variable} font-inter`}>
        <AIChessApp />
        <GoBackButton />
        <ScrollTopButton />
        <Footer />
      </div>
    </main>
  );
}
