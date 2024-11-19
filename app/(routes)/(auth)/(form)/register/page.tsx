"use client";

import AuthForm from "@/components/auth/auth-form";
import { Button } from "@/components/ui/button";
import { useAuthLabel } from "@/hooks/useAuthLabel";
import { signInWithGoogle } from "@/lib/auth/oauth/oauth";
import { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";

export default function RegisterPage() {
  const { setLabel, setSubLabel } = useAuthLabel();

  const handleGoogleLogin = () => {
    signInWithGoogle();
  };

  useEffect(() => {
    setLabel("Start your learning journey");
    setSubLabel("Create an account and unlock AI-powered study tools");
  }, [setLabel, setSubLabel]);

  return (
    <div className="mx-auto w-full max-w-sm lg:w-96">
      <div>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/sign-in"
            className="font-medium text-black hover:text-gray-800 hover:underline"
          >
            Sign in
          </a>
        </p>
      </div>

      <div className="mt-8">
        <div>
          <Button
            onClick={handleGoogleLogin}
            className="flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          >
            <FcGoogle size={20} />
            Sign up with Google
          </Button>
        </div>

        <div className="relative mt-6">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <AuthForm type="register" />
      </div>
    </div>
  );
}
