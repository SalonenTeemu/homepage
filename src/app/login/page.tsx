import CustomCursor from "@/app/components/common/customCursor";
import Navbar from "@/app/components/common/navbar";
import ScrollTopButton from "@/app/components/common/scrollTopButton";
import Login from "@/app/components/login/login";
import Footer from "../components/common/footer";
import { inter } from "@/app/components/common/fonts";

/**
 * The login page.
 *
 * @returns {JSX.Element} The login page
 */
export default function LoginPage() {
  return (
    <main className="w-full min-h-screen relative bg-slate-950 text-slate-50 selection:bg-lime-500 scroll-smooth">
      <CustomCursor />
      <Navbar />
      <div
        className={`w-full h-full flex flex-col items-center justify-between ${inter.variable} font-inter`}>
        <Login />
        <ScrollTopButton />
        <Footer />
      </div>
    </main>
  );
}
