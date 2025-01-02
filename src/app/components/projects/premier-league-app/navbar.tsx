"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Navigation bar for the Premier League App.
 *
 * @returns {JSX.Element} Navbar component
 */
export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="bg-slate-900 py-2 mt-2">
      <div className="container mx-auto flex justify-center space-x-20">
        <Link
          href="/projects/premier-league-app/"
          className={`text-md font-bold selection:text-slate-950 ${
            pathname === "/projects/premier-league-app"
              ? "text-lime-500 hover:text-slate-50"
              : "hover:text-lime-500"
          }`}>
          Standings
        </Link>
        <Link
          href="/projects/premier-league-app/matches"
          className={`text-md font-bold selection:text-slate-950 ${
            pathname === "/projects/premier-league-app/matches"
              ? "text-lime-500 hover:text-slate-50"
              : "hover:text-lime-500"
          }`}>
          Fixtures
        </Link>
      </div>
    </nav>
  );
}
