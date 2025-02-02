"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import PopupMenu from "@/app/components/common/popupMenu";
import MenuIcon from "@/app/assets/icons/menuIcon";

export default function Navbar() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setSidebarOpen(false);
      }
    };

    if (sidebarOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [sidebarOpen]);

  return (
    <>
      <nav className="w-full py-4 bg-slate-950 text-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center relative">
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

          <div className="relative" ref={menuRef}>
            <button
              className="fixed top-4 right-4 text-slate-50 hover:text-lime-500 transition-none md:transition ease-in-out md:hover:-translate-y-1 duration-150 motion-reduce:transition-none z-50"
              onClick={toggleSidebar}
              aria-label="Toggle Sidebar">
              <MenuIcon />
            </button>

            {sidebarOpen && <PopupMenu isOpen={sidebarOpen} />}
          </div>
        </div>
      </nav>
    </>
  );
}
