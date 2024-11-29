import { axiosInstance } from "@/lib/axios";
import { TRegisterSchema } from "@/lib/types/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useRegister = (
  onSuccess: () => void,
  onError: (error: { message: string; status: number }) => void,
) => {
  const registerFunction = async (data: TRegisterSchema) => {
    const res = await axiosInstance.post("/api/auth/register", {
      ...data,
    });

    return res.data;
  };

  const registerMutation = useMutation({
    mutationFn: registerFunction,
    onError: (e: any) => {
      const errorMessage = e.response?.data?.message || "Something went wrong";
      const errorStatus = e.response?.data?.status || 500;
      onError({ message: errorMessage, status: errorStatus });
    },

    onSuccess: async () => {
      toast.success("Register Success!");
      onSuccess();
    },
  });

  return registerMutation;
};
