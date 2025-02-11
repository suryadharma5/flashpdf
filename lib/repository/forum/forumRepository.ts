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

export const getAllForum = async (userId: string, tx?: PrismaTransaction) => {
  const prismaTx = tx || prismaClient;

  const forums = await prismaTx.forum.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      createdAt: true,
      title: true,
      description: true,
      documentId: true,
      totalLike: true,
      user: {
        select: {
          username: true,
          image: true,
        },
      },
      likes: {
        where: { userId },
        select: { id: true },
      },
      comments: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!forums) {
    return null;
  }

  return forums;
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
  } catch (e) {
    return { success: false };
  }
};

export const getLikeById = async (forumId: string, userId: string) => {
  const like = await prismaClient.forumLike.findFirst({
    where: {
      forumId: forumId,
      userId: userId,
    },
  });

  if (!like) {
    return null;
  }

  return like;
};

export const createLike = async (forumId: string, userId: string) => {
  await prismaClient.forumLike.create({
    data: {
      forumId,
      userId,
    },
  });

  const like = await prismaClient.forum.update({
    where: {
      id: forumId,
    },
    data: {
      totalLike: {
        increment: 1,
      },
    },
  });

  return like.totalLike;
};

export const deleteLike = async (id: string, forumId: string) => {
  await prismaClient.forumLike.delete({
    where: {
      id,
    },
  });

  const like = await prismaClient.forum.update({
    where: {
      id: forumId,
    },
    data: {
      totalLike: {
        decrement: 1,
      },
    },
  });

  return like.totalLike;
};

export const createComment = async (
  forumId: string,
  userId: string,
  comment: string,
) => {
  const newComment = await prismaClient.comment.create({
    data: {
      forumId,
      userId,
      comment,
    },
  });

  if (!newComment) {
    return null;
  }

  return newComment;
};

export const getCommentsById = async (forumId: string) => {
  const comments = await prismaClient.comment.findMany({
    where: {
      forumId,
    },
    select: {
      id: true,
      comment: true,
      createdAt: true,
      user: {
        select: {
          username: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!comments) {
    return null;
  }

  return comments;
};
