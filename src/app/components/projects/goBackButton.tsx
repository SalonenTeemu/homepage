"use client";

import Link from "next/link";
import LeftArrow from "@/app/assets/icons/leftArrow";

export default function GoBackButton() {
  return (
    <Link
      href="/projects"
      className="fixed top-4 left-4 px-4text-slate-50 hover:text-lime-500 hover:border-lime-500 transition-none md:transition ease-in-out md:hover:-translate-y-1 duration-150 motion-reduce:transition-none"
    >
      <LeftArrow />
    </Link>
  );
}
