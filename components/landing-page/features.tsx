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
      <h2 className="text-3xl font-extrabold text-gray-900 text-center">
        Features
      </h2>
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Carousel for medium size view */}
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32 hidden md:block">
            <div className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
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
                      <div className="bg-white p-6 rounded-lg shadow-md h-full">
                        <div className="flex flex-col items-center text-center h-full">
                          <div className="flex items-center justify-center h-20 w-20 rounded-md bg-black text-white mb-4">
                            {feature.icon}
                          </div>
                          <h3 className="text-xl font-semibold mb-2">
                            {feature.title}
                          </h3>
                          <p className="text-gray-600 hidden flex-grow md:block">
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
        <div className="md:hidden mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2">
          {features.map((feature, idx) => (
            <div className="pt-6" key={idx}>
              <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div>
                    <span className="inline-flex items-center justify-center p-3 bg-black rounded-md shadow-lg">
                      {feature.icon}
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
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
