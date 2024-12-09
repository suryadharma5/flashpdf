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
import { useLogin } from "@/hooks/useLogin";
import { useRegister } from "@/hooks/useRegister";
import { REDIRECT_ROUTE } from "@/lib/auth/oauth/oauth";
import {
  loginSchema,
  registerSchema,
  TLoginSchema,
  TRegisterSchema,
} from "@/lib/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";
import { z } from "zod";
import { FormError } from "./form-error";
import { FormSuccess } from "./form-success";

type AuthFormProps = {
  type: "login" | "register";
};

type ErrorAuthenticationProps = {
  status?: number;
  message?: string;
};

export default function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorLogin, setErrorLogin] = useState<ErrorAuthenticationProps | null>(
    null,
  );
  const [errorRegister, setErrorRegister] =
    useState<ErrorAuthenticationProps | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

  const { mutate: login, isPending: loginPending } = useLogin(
    () => {
      form.reset();
      router.push(REDIRECT_ROUTE);
    },
    (error: { message: string; status: number }) => {
      setErrorLogin(error);
      form.resetField("password");
    },
  );

  const { mutate: register, isPending: registerPending } = useRegister(
    () => {
      form.reset();
      setSuccess("Confirmation email sent!");
      setErrorRegister(null);
    },
    (error: { message: string; status: number }) => {
      setErrorRegister(error);
      setSuccess(null);
      form.resetField("password");
      form.resetField("confirmPassword");
    },
  );

  const handleLogin = async (data: TLoginSchema) => {
    setErrorLogin(null);
    login(data);
  };

  const handleRegister = async (data: TRegisterSchema) => {
    setErrorRegister(null);
    setSuccess(null);
    register(data);
  };

  const handleSubmit = async (data: AuthenticationType) => {
    if (type === "login") {
      await handleLogin(data);
    } else {
      await handleRegister(data as TRegisterSchema);
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
            message={errorLogin?.message || errorRegister?.message}
            type={errorLogin?.status === 401 ? "warning" : "error"}
          />

          <FormSuccess message={success} />

          <div>
            <Button
              type="submit"
              disabled={loginPending || registerPending}
              className="flex w-full justify-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-800"
            >
              <ClipLoader
                color="white"
                size={15}
                className="mr-1"
                loading={loginPending || registerPending}
              />
              <p>
                {loginPending || registerPending
                  ? "Loading..."
                  : type === "login"
                    ? "Sign In"
                    : "Create Account"}
              </p>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
