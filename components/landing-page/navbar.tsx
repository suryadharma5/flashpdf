"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  const scrollToElement = (elementID: string) => {
    const section = document.getElementById(elementID);
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById("hero");
      if (section) {
        if (window.scrollY > section.offsetTop - 10) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-20 ${isScrolled ? "bg-white/30 shadow-sm backdrop-blur-md" : "bg-transparent"} transition-all duration-300`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <span className="text-2xl font-bold text-black">FlashAI</span>
            </div>
          </div>
          <div className="flex items-center sm:ml-6 sm:space-x-8">
            <button
              className="hidden rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 sm:block"
              onClick={() => scrollToElement("features")}
            >
              Features
            </button>
            <button
              className="hidden rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 sm:block"
              onClick={() => scrollToElement("how-it-works")}
            >
              How It Works
            </button>
            <Button
              className="bg-black text-white hover:bg-gray-800"
              onClick={() => router.push("/sign-in")}
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
