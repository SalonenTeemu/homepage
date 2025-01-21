"use client";

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  return (
    <div
      className={`fixed top-4 right-4 mt-6 w-48 bg-slate-800 text-slate-50 shadow-lg rounded-md transform transition-transform duration-300 ${
        isOpen
          ? "scale-100 opacity-100"
          : "scale-95 opacity-0 pointer-events-none"
      } z-50`}>
      <div className="p-4 space-y-4">
        <ul className="space-y-2">
          <li>
            <a href="/" className="hover:text-lime-500">
              XXX
            </a>
          </li>
          <li>
            <a href="/resume" className="hover:text-lime-500">
              YYY
            </a>
          </li>
          <li>
            <a href="/projects" className="hover:text-lime-500">
              ZZZ
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
