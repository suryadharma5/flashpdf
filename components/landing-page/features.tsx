"use client";

import {
  Brain,
  ChartNoAxesColumn,
  FileText,
  MessagesSquare,
  UserPen,
} from "lucide-react";

import { useEffect, useState } from "react";

export default function Features() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      title: "Easy Document Upload",
      subtitle:
        "Simply drag and drop your PDF files or click to upload. Our system processes your documents quickly and securely.",
      icon: <FileText color="white" size={30} />,
    },
    {
      title: "AI-Powered Flashcards",
      subtitle:
        "Our advanced AI analyzes your PDF content and generates intelligent flashcards based on your specific questions.",
      icon: <Brain color="white" size={30} />,
    },
    {
      title: "Personalized Learning",
      subtitle:
        "Tailor your flashcards by asking specific questions. Our AI adapts to your learning style and focuses on what you need to know.",
      icon: <UserPen color="white" size={30} />,
    },
    {
      title: "Community Forum",
      subtitle:
        "Share your flashcards with other users, discuss study strategies, and collaborate on learning materials.",
      icon: <MessagesSquare color="white" size={30} />,
    },
    {
      title: "Progress Tracking",
      subtitle:
        "Monitor your learning journey with detailed progress reports and performance analytics for each test taken.",
      icon: <ChartNoAxesColumn color="white" size={30} />,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % (features.length - 2));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-16" id="features">
      <h2 className="text-center text-3xl font-extrabold text-gray-900">
        Features
      </h2>
      <div className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl">
          {/* Carousel for medium size view */}
          <div className="relative z-10 hidden bg-white pb-8 sm:pb-16 md:block md:pb-20 lg:pb-28 xl:pb-32">
            <div className="mx-auto mt-10 max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="flex overflow-hidden p-2">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${activeFeature * (100 / 3)}%)`,
                    width: `${(6 / 3) * 100}%`,
                  }}
                >
                  {features.map((feature, index) => (
                    <div key={index} className="w-1/3 flex-shrink-0 px-4">
                      <div className="h-full rounded-lg bg-white p-6 shadow-md">
                        <div className="flex h-full flex-col items-center text-center">
                          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-md bg-black text-white">
                            {feature.icon}
                          </div>
                          <h3 className="mb-2 text-xl font-semibold">
                            {feature.title}
                          </h3>
                          <p className="hidden flex-grow text-gray-600 md:block">
                            {feature.subtitle}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* End carousel view */}

        {/* small size view */}
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 md:hidden">
          {features.map((feature, idx) => (
            <div className="pt-6" key={idx}>
              <div className="flow-root rounded-lg bg-gray-50 px-6 pb-8">
                <div className="-mt-6">
                  <div>
                    <span className="inline-flex items-center justify-center rounded-md bg-black p-3 shadow-lg">
                      {feature.icon}
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium tracking-tight text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="mt-5 text-base text-gray-500">
                    {feature.subtitle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* end small size view */}
      </div>
    </div>
  );
}
