"use client";

import { useAuthLabel } from "@/hooks/useAuthLabel";
import LoginImage from "@/public/oc-growing.svg";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { label, sublabel } = useAuthLabel();

  return (
    <div className="flex h-screen max-h-screen overflow-hidden">
      {/* Image Section */}
      <div className="relative hidden items-center justify-center bg-black md:flex md:w-1/2">
        <div className="relative h-full max-w-2xl px-8">
          <Image
            src={LoginImage}
            alt="Person climbing stairs with a pencil"
            width={400}
            height={400}
            className="mx-auto h-full scale-110 transform"
          />
          <div className="absolute bottom-0 left-0 right-0 mb-20 mt-5 px-8">
            <h2 className="text-3xl font-bold text-white">{label}</h2>
            <p className="mt-2 text-lg text-gray-300">{sublabel}</p>
          </div>
        </div>
      </div>

      {/* Login Form Section */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        {children}
      </div>
    </div>
  );
}
