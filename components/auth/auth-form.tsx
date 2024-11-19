"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { REDIRECT_ROUTE } from "@/lib/auth/oauth/oauth";
import { axiosInstance } from "@/lib/axios";
import { loginSchema, registerSchema, TLoginSchema } from "@/lib/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FormError } from "./form-error";

type AuthFormProps = {
  type: "login" | "register";
};

type ErrorAuthenticationProps = {
  status?: number;
  message?: string;
};

export default function AuthForm({ type }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorLogin, setErrorLogin] = useState<ErrorAuthenticationProps | null>(
    null,
  );

  const schema = type === "login" ? loginSchema : registerSchema;
  type AuthenticationType = z.infer<typeof schema>;

  const form = useForm<AuthenticationType>({
    resolver: zodResolver(schema),
    defaultValues:
      type === "login"
        ? {
            email: "",
            password: "",
          }
        : {
            email: "",
            username: "",
            password: "",
            confirmPassword: "",
          },
  });

  const handleLogin = async (data: TLoginSchema) => {
    await axiosInstance
      .post("/api/auth/login", {
        ...data,
      })
      .then(() => {
        console.log("success");
        setErrorLogin(null);
      })
      .catch((e) => {
        setErrorLogin(e.response?.data);

        if (e.response?.data?.status == 401) {
          toast.info("Email verification sent", {
            description:
              "Please verify your email first to continue using flashAI",
            duration: 5000,
          });
        }
      });

    if (errorLogin === null) {
      await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      }).then((data) => {
        if (data?.error) {
          console.log(data);
        } else {
          form.reset();

          setShowPassword(false);
          setShowConfirmPassword(false);

          toast.success("Login Success!");

          redirect(REDIRECT_ROUTE);
        }
      });
    }

    form.resetField("password");
  };

  const handleSubmit = async (data: AuthenticationType) => {
    if (type === "login") {
      await handleLogin(data);
    } else {
      console.log("handle register");
    }
  };

  return (
    <div className="mt-6">
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="mt-1">
                    <Input
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {type === "register" && (
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <div className="mt-1">
                      <Input
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                        id="username"
                        name="username"
                        type="text"
                        required
                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative mt-1">
                    <Input
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      ) : (
                        <EyeOffIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {type === "register" && (
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative mt-1">
                      <Input
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        ) : (
                          <EyeOffIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormError
            message={errorLogin?.message}
            type={errorLogin?.status === 401 ? "warning" : "error"}
          />

          <div>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="flex w-full justify-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-800"
            >
              {type === "login" ? "Sign In" : "Create Account"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
