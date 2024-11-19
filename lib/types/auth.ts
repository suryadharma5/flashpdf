import { User } from "@prisma/client";
import { Omit } from "@prisma/client/runtime/library";
import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters long")
      .max(20, "Username must be no longer than 20 characters"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(30, "Password must be no longer than 30 characters"),
    confirmPassword: z
      .string()
      .min(8, "Confirm password must be at least 8 characters long")
      .max(30, "Confirm password must be no longer than 30 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password don't match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(30, "Password must be no longer than 30 characters"),
});

export type TRegisterSchema = z.infer<typeof registerSchema>;
export type TLoginSchema = z.infer<typeof loginSchema>;

export type UserResponse = {
  user: Omit<User, "password"> & {
    token: string;
  };
};
