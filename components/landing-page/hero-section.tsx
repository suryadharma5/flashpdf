"use client";

import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

export default function HeroSection() {
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

  return (
    <motion.div
      initial={{ opacity: 0.0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.0,
        duration: 0.5,
        ease: "easeInOut",
      }}
      className="-mt-10 mb-2 flex h-[80vh] items-center justify-center px-0"
    >
      <div className="text-center">
        <h1
          className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl"
          id="hero"
        >
          <span className="block">Transform Your Documents into</span>
          <span className="block text-black">Intelligent Flashcards</span>
        </h1>
        <p className="mx-auto mt-3 max-w-md text-base text-gray-500 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
          Upload your PDF and let our AI create personalized flashcards to
          supercharge your learning.
        </p>
        <div className="mx-auto mt-5 max-w-md sm:flex sm:justify-center md:mt-8">
          <div className="rounded-md shadow">
            <Button
              type="button"
              className="flex w-full items-center justify-center rounded-md bg-black px-8 py-3 text-base font-medium text-white transition hover:bg-gray-800 md:px-10 md:py-4 md:text-lg"
              onClick={() => {
                router.push("/sign-in");
              }}
            >
              Get started
            </Button>
          </div>
          <div className="mt-3 rounded-md shadow sm:ml-3 sm:mt-0">
            <Button
              variant="outline"
              className="flex w-full items-center justify-center rounded-md bg-white px-8 py-3 text-base font-medium text-black transition md:px-10 md:py-4 md:text-lg"
              onClick={() => scrollToElement("how-it-works")}
              type="button"
            >
              Learn more
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
