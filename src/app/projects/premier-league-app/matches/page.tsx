import CustomCursor from "@/app/components/common/customCursor";
import Navbar from "@/app/components/navbar/navbar";
import ScrollTopButton from "@/app/components/common/scrollTopButton";
import GoBackButton from "@/app/components/projects/goBackButton";
import FooterText from "@/app/components/common/footerText";
import Matches from "@/app/components/projects/premier-league-app/matches";
import PremAppNavbar from "@/app/components/projects/premier-league-app/navbar";

/**
 * MatchesPage component of Premier League App.
 *
 * @returns {JSX.Element} MatchesPage component
 */
export default function MatchesPage() {
  return (
    <main className="w-full min-h-screen relative bg-slate-950 text-slate-50 selection:bg-lime-500 scroll-smooth">
      <Navbar />
      <CustomCursor />
      <PremAppNavbar />
      <div className="container mx-auto p-4">
        <Matches />
        <GoBackButton />
        <ScrollTopButton />
        <FooterText />
      </div>
    </main>
  );
}
