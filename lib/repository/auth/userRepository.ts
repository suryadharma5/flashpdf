import { prismaClient } from "@/lib/db";
import bcryptjs from "bcryptjs";
import { TRegisterSchema } from "../../types/auth";
import { PrismaTransaction } from "./tokenRepository";

export const getUserById = async (userId: string, tx?: PrismaTransaction) => {
  const prismaTx = tx || prismaClient;
  const user = await prismaTx.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return null;
  }

  return user;
};

export const getUserByEmail = async (email: string, tx?: PrismaTransaction) => {
  const prismaTx = tx || prismaClient;
  const user = await prismaTx.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    return null;
  }

  return user;
};

export const getUserByUsername = async (
  username: string,
  tx?: PrismaTransaction,
) => {
  const prismaTx = tx || prismaClient;
  const user = await prismaTx.user.findUnique({
    where: {
      username: username,
    },
  });

  if (!user) {
    return null;
  }

  return user;
};

export const createUser = async (
  request: TRegisterSchema,
  tx?: PrismaTransaction,
) => {
  const prismaTx = tx || prismaClient;
  const hashedPassword = await bcryptjs.hash(request.password, 10);

  const user = await prismaTx.user.create({
    data: {
      username: request.username,
      password: hashedPassword,
      email: request.email,
    },
  });

  if (!user) {
    return null;
  }

  const { password, ...userWithoutPassword } = user;
  const unusedVar = password; // eslint-disable-line @typescript-eslint/no-unused-vars

  return userWithoutPassword;
};

export const updateUserEmailStatus = async (
  userId: string,
  tx?: PrismaTransaction,
) => {
  const prismaTx = tx || prismaClient;

  const updatedUser = await prismaTx.user.update({
    where: {
      id: userId,
    },
    data: {
      emailVerified: new Date(),
    },
  });

  return updatedUser;
};
