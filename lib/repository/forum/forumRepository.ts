import { prismaClient } from "@/lib/db";
import { TCreateForumSchema } from "@/lib/types/forum";
import { PrismaTransaction } from "../auth/tokenRepository";

export const createForum = async (
  request: TCreateForumSchema,
  tx?: PrismaTransaction,
) => {
  const prismaTx = tx || prismaClient;

  const forum = await prismaTx.forum.create({
    data: request,
  });

  if (!forum) {
    return null;
  }

  return forum;
};

export const findForumById = async (
  forumId: string,
  tx?: PrismaTransaction,
) => {
  const prismaTx = tx || prismaClient;

  const forum = await prismaTx.forum.findUnique({
    where: {
      id: forumId,
    },
  });

  if (!forum) {
    return null;
  }

  return forum;
};

/* eslint-disable @typescript-eslint/no-unused-vars */
export const deleteForum = async (
  forumId: string,
  userId: string,
  tx?: PrismaTransaction,
) => {
  const prismaTx = tx || prismaClient;

  try {
    await prismaTx.forum.delete({
      where: {
        id: forumId,
        userId: userId,
      },
    });

    return { success: true };
  } catch (_) {
    return { success: false };
  }
};
