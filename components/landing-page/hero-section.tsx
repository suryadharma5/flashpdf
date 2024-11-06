import Image from "next/image";
import { Button } from "../ui/button";
import HeroImage from "@/public/reading.png";

export default function HeroSection() {
  return (
    <div className="px-4 py-6 sm:px-0 h-[80vh] flex justify-center items-center">
      <div className="text-center bg-red-400c">
        <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block">Transform Your Documents into</span>
          <span className="block text-black">Intelligent Flashcards</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Upload your PDF, ask questions, and let our AI create personalized
          flashcards to supercharge your learning.
        </p>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <div className="rounded-md shadow">
            <Button
              className="
                    w-full
                    flex
                    items-center
                    justify-center
                    px-8
                    py-3
                    text-base
                    font-medium
                    rounded-md
                    text-white
                    bg-black
                    hover:bg-gray-800
                    md:py-4
                    md:text-lg
                    md:px-10
                    hover:scale-110
                    transition
                "
            >
              Get started
            </Button>
          </div>
        </div>
        <Image
          className="justify-self-center mt-8 md:mt-14"
          src={HeroImage}
          alt="hero image"
          width={500}
          height={500}
        />
      </div>
    </div>
  );
}
