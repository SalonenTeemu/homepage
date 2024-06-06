import CustomCursor from "@/app/components/common/customCursor";
import Navbar from "@/app/components/navbar/navbar";
import ScrollTopButton from "@/app/components/common/scrollTopButton";
import GoBackButton from "@/app/components/projects/goBackButton";
import F1RaceScheduleApp from "@/app/components/projects/f1-race-schedule-app/f1RaceScheduleApp";
import FooterText from "@/app/components/common/footerText";
import { inter } from "@/app/components/common/fonts";

export default function ProjectsPage() {
  return (
    <main className="w-full min-h-screen relative bg-slate-950 text-slate-50 selection:bg-lime-500 scroll-smooth">
      <CustomCursor />
      <Navbar />
      <div
        className={`w-full h-full flex flex-col items-center justify-between ${inter.variable} font-inter`}
      >
        <F1RaceScheduleApp />
        <GoBackButton />
        <ScrollTopButton />
        <FooterText />
      </div>
    </main>
  );
}
