"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * The navigation bar component containing links to the homepage, resume, and projects.
 *
 * @returns {JSX.Element} Navbar component
 */
export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="w-full py-4 bg-slate-950 text-slate-50">
      <div className="max-w-7xl mx-auto px-4 flex justify-center items-center">
        <ul className="flex space-x-6">
          <li>
            <Link
              href="/"
              className={`text-md font-bold selection:text-slate-950 ${
                pathname === "/"
                  ? "text-lime-500 hover:text-slate-50"
                  : "hover:text-lime-500"
              }`}>
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/resume"
              className={`text-md font-bold selection:text-slate-950 ${
                pathname === "/resume"
                  ? "text-lime-500 hover:text-slate-50"
                  : "hover:text-lime-500"
              }`}>
              Resume
            </Link>
          </li>
          <li>
            <Link
              href="/projects"
              className={`text-md font-bold selection:text-slate-950 ${
                pathname.startsWith("/projects")
                  ? "text-lime-500 hover:text-slate-50"
                  : "hover:text-lime-500"
              }`}>
              Projects
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
