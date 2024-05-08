"use client";

import { useEffect, useState } from "react";
import UpArrow from "@/app/assets/icons/upArrow";

export default function ScrollTopButton() {
  const [visible, setVisible] = useState(false);

  const toggleVisible = () => {
    const amountScrolled = document.documentElement.scrollTop;
    if (amountScrolled > 500) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  const scrollTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisible);
  }, []);

  return (
    <div className={`fixed bottom-0 right-0 ${visible ? "visible" : "hidden"}`}>
      <button
        className="text-slate-50 hover:text-lime-500 m-8 p-4 transition-none md:transition ease-in-out md:hover:-translate-y-1 duration-150 motion-reduce:transition-none motion-reduce:hover:transform-none -z-10"
        onClick={scrollTop}
      >
        <UpArrow />
      </button>
    </div>
  );
}
