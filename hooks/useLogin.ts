import { axiosInstance } from "@/lib/axios";
import { TLoginSchema } from "@/lib/types/auth";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

export const useLogin = (
  onSuccess: () => void,
  onError: (error: { message: string; status: number }) => void,
) => {
  const loginFunction = async (data: TLoginSchema) => {
    const res = await axiosInstance.post("/api/auth/login", {
      ...data,
    });

    return res.data;
  };

  const loginMutation = useMutation({
    mutationFn: loginFunction,
    onError: (e: any) => {
      const errorMessage = e.response?.data?.message || "Something went wrong";
      const errorStatus = e.response?.data?.status || 500;
      onError({ message: errorMessage, status: errorStatus });

      if (errorStatus === 401) {
        toast.info("Email verification sent", {
          description:
            "Please verify your email first to continue using flashAI",
          duration: 5000,
        });
      }
    },

    onSuccess: async (_, variables) => {
      const { email, password } = variables;

      const result = await signIn("credentials", {
        email: email,
        password: password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error === "CredentialsSignin") {
          onError({
            message: "Invalid credentials",
            status: 400,
          });
        } else {
          console.log("Masuk sini");
          onError({
            message: "Something went wrong",
            status: 500,
          });
        }
      } else {
        toast.success("Login Success!");
        onSuccess();
      }
    },
  });

  return loginMutation;
};
