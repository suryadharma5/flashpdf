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
      document: {
        select: {
          Category: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!forums) {
    return null;
  }

  return forums;
};

export const getForumsByLimit = async (userId: string, limit: number) => {
  const forums = await prismaClient.forum.findMany({
    orderBy: {
      totalLike: "desc",
    },
    take: limit,
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
      document: {
        select: {
          Category: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!forums) {
    return null;
  }

  return forums;
};

export const getTotalForumEntries = async (
  query?: string,
  category?: string,
) => {
  const whereCondition: any = {};

  if (query && query.trim() !== "") {
    whereCondition.title = {
      contains: query,
      mode: "insensitive" as const,
    };
  }

  if (category && category.trim() !== "") {
    whereCondition.document = {
      Category: {
        name: category,
      },
    };
  }

  const totalCount = await prismaClient.forum.aggregate({
    _count: {
      id: true,
    },
    where: whereCondition,
  });

  return totalCount;
};

export const getPaginatedForums = async (
  userId: string,
  limit: number,
  offset: number,
  query?: string,
  category?: string,
  sort?: string,
) => {
  const whereCondition: any = {};

  if (query && query.trim() !== "") {
    whereCondition.title = {
      contains: query,
      mode: "insensitive" as const,
    };
  }

  if (category && category.trim() !== "") {
    whereCondition.document = {
      Category: {
        name: category,
      },
    };
  }

  let orderBy: any = {
    totalLike: "desc",
  };

  if (sort) {
    switch (sort) {
      case "oldest":
        orderBy = {
          createdAt: "asc",
        };
        break;
      case "latest":
        orderBy = {
          createdAt: "desc",
        };
        break;
      case "like":
        orderBy = {
          totalLike: "desc",
        };
        break;
      default:
        orderBy = {
          totalLike: "desc",
        };
        break;
    }
  }

  const forums = await prismaClient.forum.findMany({
    skip: offset,
    take: limit,
    orderBy: orderBy,
    where: whereCondition,
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
      document: {
        select: {
          Category: {
            select: {
              name: true,
            },
          },
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
          id: true,
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

export const deleteComment = async (commentId: string, userId: string) => {
  const comment = await prismaClient.comment.findUnique({
    where: {
      id: commentId,
    },
  });

  if (!comment) {
    return { status: 404 };
  }

  const deletedComment = await prismaClient.comment.delete({
    where: {
      id: commentId,
      userId: userId,
    },
  });

  if (!deletedComment) {
    return { status: 500 };
  }

  return { status: 200 };
};
