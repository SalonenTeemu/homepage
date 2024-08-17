import CustomCursor from "@/app/components/common/customCursor";
import Navbar from "@/app/components/navbar/navbar";
import ScrollTopButton from "@/app/components/common/scrollTopButton";
import GoBackButton from "@/app/components/projects/goBackButton";
import FooterText from "@/app/components/common/footerText";
import Standings from "@/app/components/projects/premier-league-app/standings";
import PremAppNavbar from "@/app/components/projects/premier-league-app/navbar";

export default function Home() {
  return (
    <main className="w-full min-h-screen relative bg-slate-950 text-slate-50 selection:bg-lime-500 scroll-smooth">
      <Navbar />
      <CustomCursor />
      <PremAppNavbar />
      <div className="container mx-auto p-4">
        <Standings />
        <GoBackButton />
        <ScrollTopButton />
        <FooterText />
      </div>
    </main>
  );
}
