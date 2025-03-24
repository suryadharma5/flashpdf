"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import PlaceHolderImage from "@/public/placeholder.svg";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";

export default function Guidance() {
  const [marginTop, setMarginTop] = useState(0);
  const items = [
    {
      title: "Upload Your PDF",
      subtitle:
        "Simply drag and drop your study material or lecture notes in PDF format.",
    },
    {
      title: "AI Analysis",
      subtitle:
        "Our advanced AI reads and understands your document, identifying key concepts.",
    },
    {
      title: "Flashcard Generation",
      subtitle:
        "Intelligent flashcards are created, focusing on the most important information.",
    },
    {
      title: "Study and Review",
      subtitle:
        "Use the generated flashcards to study efficiently and track your progress.",
    },
  ];

  const router = useRouter();
  const isMobile = useIsMobile();

  return (
    <>
      <div id="how-it-works" className={isMobile ? "mt-60" : ""}>
        <motion.div
          initial={{ opacity: 0, x: 0 }}
          whileInView={{ opacity: 1, x: 0, scale: 1.02 }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
            delay: 0.2,
          }}
          viewport={{ once: true, amount: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-gray-100 md:text-4xl">
            How FlashAI Works
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            FlashAI transforms study materials into effective learning tools
            with personalized flashcards, quizzes, and review sessions. .
          </p>
        </motion.div>
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          <div className="space-y-4">
            {items.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0, scale: 1.02 }}
                transition={{
                  duration: 0.5,
                  ease: "easeOut",
                  delay: idx * 0.1,
                }}
                viewport={{ once: true }}
                className="flex items-start"
              >
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-black text-white">
                    {idx + 1}
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{item.subtitle}</p>
                </div>
              </motion.div>
            ))}
          </div>
          {/* end */}
          <div className="mt-10 md:mt-0">
            <Image
              src={PlaceHolderImage}
              alt="Visual guide on how to use FlashAI"
              width={300}
              height={300}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
      <div className="mt-20 text-center">
        <h2 className="text-3xl font-extrabold text-gray-900">
          Ready to revolutionize your study method?
        </h2>
        <div className="mt-8">
          <Button
            className="rounded-md border border-transparent bg-black px-8 py-3 text-base font-medium text-white transition hover:scale-110 hover:bg-gray-800 md:px-10 md:py-4 md:text-lg"
            onClick={() => router.push("/sign-in")}
          >
            Start Creating Flashcards
          </Button>
        </div>
      </div>
    </>
  );
}
