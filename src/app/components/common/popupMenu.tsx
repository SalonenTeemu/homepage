"use client";

import Link from "next/link";
import { useAuth } from "@/app/context/authContext";

interface PopupMenuProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: PopupMenuProps) {
  const authContext = useAuth();
  const user = authContext?.user;
  const logout = authContext?.logout;

  return (
    <div
      className={`fixed top-4 right-4 mt-6 w-48 bg-slate-800 text-slate-50 shadow-lg rounded-md transform transition-transform duration-300 ${
        isOpen
          ? "scale-100 opacity-100"
          : "scale-95 opacity-0 pointer-events-none"
      } z-50`}>
      <div className="p-4 space-y-4">
        <ul className="space-y-2">
          {!user ? (
            <>
              <li>
                <Link href="/register" className="hover:text-lime-500">
                  Register
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-lime-500">
                  Login
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/profile" className="hover:text-lime-500">
                  Profile
                </Link>
              </li>
              <li>
                <button
                  onClick={logout}
                  className="w-full text-left hover:text-red-500">
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
