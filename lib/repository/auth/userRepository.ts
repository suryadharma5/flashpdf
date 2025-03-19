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
    select: {
      id: true,
      image: true,
      username: true,
      emailVerified: true,
      email: true,
      name: true,
      currentStreak: true,
      longestStreak: true,
      lastActivityDate: true,
      streakUpdatedAt: true,
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

export const updateUserUsername = async (
  userId: string,
  username: string,
  tx?: PrismaTransaction,
) => {
  const prismaTx = tx || prismaClient;

  const updatedUser = await prismaTx.user.update({
    where: {
      id: userId,
    },
    data: {
      username: username,
    },
    select: {
      id: true,
      username: true,
    },
  });

  return updatedUser;
};

export const updateUserProfileImage = async (
  userId: string,
  imageUrl: string,
) => {
  const updatedUser = await prismaClient.user.update({
    where: {
      id: userId,
    },
    data: {
      image: imageUrl,
    },
    select: {
      id: true,
      image: true,
    },
  });

  if (!updatedUser) {
    return null;
  }

  return updatedUser;
};

export const updateUserStreak = async (userId: string) => {
  // Ambil data user dari database
  const user = await getUserById(userId);

  if (!user) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset ke awal hari

  if (!user.lastActivityDate) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        currentStreak: 1,
        longestStreak: 1,
        lastActivityDate: today,
        streakUpdatedAt: new Date(),
      },
    });
    return;
  }

  const lastActivity = new Date(user.lastActivityDate);
  lastActivity.setHours(0, 0, 0, 0);

  const timeDiff = today.getTime() - lastActivity.getTime();
  const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

  let newStreak = user.currentStreak;

  if (dayDiff === 0) {
    return;
  } else if (dayDiff === 1) {
    newStreak = user.currentStreak + 1;
  } else {
    newStreak = 0;
  }

  // Update user di database
  await prisma.user.update({
    where: { id: userId },
    data: {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, user.longestStreak),
      lastActivityDate: today,
      streakUpdatedAt: new Date(),
    },
  });
};

export const resetStreakIfInactive = async (userId: string) => {
  const user = await getUserById(userId);
  if (!user) return null;

  if (!user.lastActivityDate) return user; // Jika belum ada aktivitas, tidak perlu reset

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set ke awal hari

  const lastActivity = new Date(user.lastActivityDate);
  lastActivity.setHours(0, 0, 0, 0);

  const dayDiff = Math.floor(
    (today.getTime() - lastActivity.getTime()) / (1000 * 3600 * 24),
  );

  if (dayDiff > 1) {
    // Jika lebih dari 1 hari, reset streak ke 0
    return await prisma.user.update({
      where: { id: userId },
      data: { currentStreak: 0 },
    });
  }

  return user;
};
