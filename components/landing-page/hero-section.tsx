"use client";

import HeroImage from "@/public/reading.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export default function HeroSection() {
  const router = useRouter();
  return (
    <div className="flex h-[80vh] items-center justify-center px-4 py-6 sm:px-0">
      <div className="bg-red-400c text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block">Transform Your Documents into</span>
          <span className="block text-black">Intelligent Flashcards</span>
        </h1>
        <p className="mx-auto mt-3 max-w-md text-base text-gray-500 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
          Upload your PDF, ask questions, and let our AI create personalized
          flashcards to supercharge your learning.
        </p>
        <div className="mx-auto mt-5 max-w-md sm:flex sm:justify-center md:mt-8">
          <div className="rounded-md shadow">
            <Button
              className="flex w-full items-center justify-center rounded-md bg-black px-8 py-3 text-base font-medium text-white transition hover:bg-gray-800 md:px-10 md:py-4 md:text-lg"
              onClick={() => router.push("/sign-in")}
            >
              Get started
            </Button>
          </div>
          <div className="mt-3 rounded-md shadow sm:ml-3 sm:mt-0">
            <Button
              variant="outline"
              className="flex w-full items-center justify-center rounded-md bg-white px-8 py-3 text-base font-medium text-black transition md:px-10 md:py-4 md:text-lg"
            >
              <a href="#how-it-works">Learn more</a>
            </Button>
          </div>
        </div>
        <Image
          className="mt-8 justify-self-center md:mt-14"
          src={HeroImage}
          alt="hero image"
          width={500}
          height={500}
        />
      </div>
    </div>
  );
}
