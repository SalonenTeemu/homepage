import Navbar from "@/app/components/navbar/navbar";
import CustomCursor from "@/app/components/common/customCursor";
import GoBackButton from "@/app/components/projects/goBackButton";
import Footer from "@/app/components/common/footer";
import Constructors from "@/app/components/projects/f1-app/constructors";
import F1AppNavbar from "@/app/components/projects/f1-app/navbar";
import ScrollTopButton from "@/app/components/common/scrollTopButton";

export default function ConstructorsPage() {
  return (
    <main className="w-full min-h-screen relative bg-slate-950 text-slate-50 selection:bg-lime-500 scroll-smooth">
      <Navbar />
      <CustomCursor />
      <F1AppNavbar />
      <div className="container mx-auto p-4">
        <Constructors />
        <GoBackButton />
        <ScrollTopButton />
        <Footer />
      </div>
    </main>
  );
}
