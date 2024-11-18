"use client";

import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/axios";
import EmailFailedImage from "@/public/email-failed.svg";
import EmailVerifiedImage from "@/public/email-verified.svg";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const VerificationPage = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState(""); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [success, setSuccess] = useState("");

  const onSubmit = useCallback(async () => {
    if (!token) {
      setError("Missing token!");
      return;
    }

    await axiosInstance
      .get(`/api/auth/verify-token/${token}`)
      .then((data) => {
        setSuccess("success");
        console.log(data);
      })
      .catch((e) => {
        setError(e);
        console.log(e.message);
      });
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <div className="flex h-full flex-col items-center justify-center">
      {success ? (
        <>
          <Image
            src={EmailVerifiedImage}
            alt="Email verified"
            width={400}
            height={400}
          />
          <h1 className="mt-12 text-5xl font-bold">Email Verified!</h1>
          <p className="mt-4 text-gray-400">
            Let's create your first set of flashcards.
          </p>
          <Link href="/dashboard/home">
            <Button className="mt-5 px-12 py-2">Get Started</Button>
          </Link>
        </>
      ) : (
        <>
          <Image
            src={EmailFailedImage}
            alt="Failed to verify email"
            width={250}
            height={250}
          />
          <h1 className="mt-12 text-5xl font-bold">Failed to verify email</h1>
          <p className="mt-4 text-gray-400">Try to signing in again</p>
          <Link href="/sign-in">
            <Button className="mt-5 px-12 py-2">Sign In</Button>
          </Link>
        </>
      )}
    </div>
  );
};

export default VerificationPage;
