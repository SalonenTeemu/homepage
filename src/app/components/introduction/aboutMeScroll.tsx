"use client";

import Link from "next/link";
import DownArrow from "@/app/assets/icons/downArrow";

/**
 * An arrow component that scrolls to the about section.
 * 
 * @returns {JSX.Element} AboutMeScroll component
 */
export default function AboutMeScroll() {
  return (
    <Link
      href="#about"
      scroll={false}
      className="flex flex-col text-center justify-center items-center hover:text-lime-500 transition-none md:transition ease-in-out md:hover:-translate-y-1 duration-150 motion-reduce:transition-none"
      onClick={(e) => {
        e.preventDefault();

        if (document) {
          document
            .getElementById("about")
            ?.scrollIntoView({ behavior: "smooth" });
        }
      }}
    >
      <p className="pb-1">LEARN MORE</p>
      <DownArrow />
    </Link>
  );
}
