"use client";

import Link from "next/link";
import DownArrow from "@/app/assets/icons/downArrow";

export default function aboutMeScroll() {
  return (
    <Link
      href="#about"
      scroll={false}
      className="flex flex-col text-center justify-center items-center hover:text-lime-500"
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
