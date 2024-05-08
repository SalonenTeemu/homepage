import CustomCursor from "@/app/components/common/customCursor";
import Introduction from "@/app/components/introduction/introduction";
import AboutMe from "@/app/components/about/aboutMe";
import ScrollTopButton from "@/app/components/common/scrollTopButton";
import { inter } from "@/app/components/common/fonts";

export default function Home() {
  return (
    <main className="w-full min-h-screen relative bg-slate-950 text-slate-50 selection:bg-lime-500 scroll-smooth">
      <CustomCursor />
      <div
        className={`w-full h-full flex flex-col items-center justify-between ${inter.variable} font-inter`}
      >
        <Introduction />
        <AboutMe />
        <ScrollTopButton />
        <div className="w-full flex justify-center pb-8">
          Teemu Salonen © 2024
        </div>
      </div>
    </main>
  );
}
