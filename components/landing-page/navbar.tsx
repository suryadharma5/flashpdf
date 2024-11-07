"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="fixed left-0 right-0 top-0 z-20 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <span className="text-2xl font-bold text-black">FlashAI</span>
            </div>
          </div>
          <div className="flex items-center sm:ml-6 sm:space-x-8">
            <a
              href="#features"
              className="hidden rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 sm:block"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="hidden rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 sm:block"
            >
              How It Works
            </a>
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
