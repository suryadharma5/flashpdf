"use client";

import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs-features";
import Image2 from "@/public/AskAI.svg";
import Image1 from "@/public/EasyUpload.svg";
import Image4 from "@/public/Forum.svg";
import Image5 from "@/public/Progress.svg";
import Image3 from "@/public/Review.svg";
import { motion } from "framer-motion";
import {
  BarChart3,
  Brain,
  FileText,
  MessagesSquare,
  NotebookPen,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function FeatureSection() {
  const features = [
    {
      title: "Easy Document Upload",
      value: "upload",
      content: (
        <div className="relative h-fit w-full overflow-hidden rounded-xl border border-gray-200 bg-white p-8 text-gray-800 shadow-sm">
          <div className="flex flex-col items-start gap-8 md:flex-row">
            <div className="flex-shrink-0 rounded-lg border border-gray-200 bg-gray-100 p-4">
              <FileText size={30} />
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-medium md:text-2xl">
                Easy Document Upload
              </h3>
              <p className="text-gray-600">
                Simply drag and drop your PDF files or click to upload. Our
                system processes your documents quickly and securely.
              </p>
              <Link href={"/sign-in"}>
                <Button className="mt-3 rounded-md px-4 py-2 text-sm font-medium text-white transition-colors">
                  Try It Now
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative mt-8 h-fit w-full overflow-hidden rounded-lg border-gray-200 py-6">
            <Image
              src={Image1}
              alt="Document Upload Feature"
              className="h-full w-full object-fill"
              width={600}
              height={400}
            />
          </div>
        </div>
      ),
    },
    {
      title: "AI-Powered Flashcards",
      value: "flashcards",
      content: (
        <div className="relative h-fit w-full overflow-hidden rounded-xl border border-gray-200 bg-white p-8 text-gray-800 shadow-sm">
          <div className="flex flex-col items-start gap-8 md:flex-row">
            <div className="flex-shrink-0 rounded-lg border border-gray-200 bg-gray-100 p-4">
              <Brain size={30} />
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-medium md:text-2xl">
                AI-Powered Flashcards
              </h3>
              <p className="text-gray-600">
                Our advanced AI analyzes your PDF content and generates
                intelligent flashcards based on your specific questions.
              </p>
              <Link href={"/sign-in"}>
                <Button className="mt-3 rounded-md px-4 py-2 text-sm font-medium text-white transition-colors">
                  Explore AI Features
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative mt-8 h-fit w-full overflow-hidden rounded-lg border-gray-200 py-6">
            <Image
              src={Image2}
              alt="Document Upload Feature"
              className="h-full w-full object-fill"
              width={600}
              height={400}
            />
          </div>
        </div>
      ),
    },
    {
      title: "Review Test",
      value: "review-test",
      content: (
        <div className="relative h-fit w-full overflow-hidden rounded-xl border border-gray-200 bg-white p-8 text-gray-800 shadow-sm">
          <div className="flex flex-col items-start gap-8 md:flex-row">
            <div className="flex-shrink-0 rounded-lg border border-gray-200 bg-gray-100 p-4">
              <NotebookPen size={30} />
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-medium md:text-2xl">Review Test</h3>
              <p className="text-gray-600">
                After completing a test, revisit your answers and compare them
                with the correct ones. Enhance your learning by understanding
                mistakes and improving retention.
              </p>
              <Link href={"/sign-in"}>
                <Button className="mt-3 rounded-md px-4 py-2 text-sm font-medium text-white transition-colors">
                  Study Now
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative mt-8 h-fit w-full overflow-hidden rounded-lg border-gray-200 py-6">
            <Image
              src={Image3}
              alt="Document Upload Feature"
              className="h-full w-full object-fill"
              width={600}
              height={400}
            />
          </div>
        </div>
      ),
    },
    {
      title: "Community Forum",
      value: "community",
      content: (
        <div className="relative h-fit w-full overflow-hidden rounded-xl border border-gray-200 bg-white p-8 text-gray-800 shadow-sm">
          <div className="flex flex-col items-start gap-8 md:flex-row">
            <div className="flex-shrink-0 rounded-lg border border-gray-200 bg-gray-100 p-4">
              <MessagesSquare size={30} />
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-medium md:text-2xl">
                Community Forum
              </h3>
              <p className="text-gray-600">
                Share your flashcards with other users, discuss study
                strategies, and collaborate on learning materials.
              </p>
              <Link href={"/sign-in"}>
                <Button className="mt-3 rounded-md px-4 py-2 text-sm font-medium text-white transition-colors">
                  Join Community
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative mt-8 h-fit w-full overflow-hidden rounded-lg border-gray-200 py-6">
            <Image
              src={Image4}
              alt="Document Upload Feature"
              className="h-full w-full object-fill"
              width={600}
              height={400}
            />
          </div>
        </div>
      ),
    },
    {
      title: "Progress Tracking",
      value: "tracking",
      content: (
        <div className="relative h-fit w-full overflow-hidden rounded-xl border border-gray-200 bg-white p-8 text-gray-800 shadow-sm">
          <div className="flex flex-col items-start gap-8 md:flex-row">
            <div className="flex-shrink-0 rounded-lg border border-gray-200 bg-gray-100 p-4">
              <BarChart3 size={30} />
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-medium md:text-2xl">
                Progress Tracking
              </h3>
              <p className="text-gray-600">
                Monitor your learning journey with detailed progress reports and
                performance analytics for each test taken.
              </p>
              <Link href={"/sign-in"}>
                <Button className="mt-3 rounded-md px-4 py-2 text-sm font-medium text-white transition-colors">
                  View Analytics
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative mt-8 h-fit w-full overflow-hidden rounded-lg border-gray-200 py-6">
            <Image
              src={Image5}
              alt="Document Upload Feature"
              className="h-full w-full object-fill"
              width={600}
              height={400}
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <section
      className="relative z-0 bg-white px-4 py-16 dark:bg-gray-900"
      id="features"
    >
      <div className="mx-auto max-w-6xl">
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
            Powerful Features
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Our platform offers everything you need to transform your study
            materials into effective learning tools.
          </p>
        </motion.div>

        <div className="relative flex h-[40rem] w-full flex-col items-start justify-start [perspective:1000px] md:h-[45rem]">
          <Tabs
            tabs={features}
            containerClassName="justify-start md:justify-center mb-8 overflow-x-auto pb-2 -mx-4 px-4 w-[calc(100%+2rem)]"
            activeTabClassName="bg-primary text-white"
            tabClassName="font-medium text-sm whitespace-nowrap"
            contentClassName="mt-8 md:mt-12"
          />
        </div>
      </div>
    </section>
  );
}
