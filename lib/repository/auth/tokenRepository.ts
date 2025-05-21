import { prismaClient } from "@/lib/db";
import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

export type PrismaTransaction = Omit<
  PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

type TokenProps = {
  email: string;
  token: string;
  expiresAt: Date;
};

export const getTokenByUserEmail = async (
  email: string,
  tx?: PrismaTransaction,
) => {
  const prismaTx = tx || prismaClient;
  const token = await prismaTx.verificationToken.findUnique({
    where: {
      email: email,
    },
  });

  return token;
};

export const getToken = async (token: string, tx?: PrismaTransaction) => {
  const prismaTx = tx || prismaClient;
  const existingToken = await prismaTx.verificationToken.findUnique({
    where: {
      token: token,
    },
  });

  return existingToken;
};

export const deleteTokenById = async (
  tokenId: string,
  tx?: PrismaTransaction,
) => {
  const prismaTx = tx || prismaClient;
  await prismaTx.verificationToken.delete({
    where: {
      id: tokenId,
    },
  });
};

export const createVerificationToken = async (
  data: TokenProps,
  tx?: PrismaTransaction,
) => {
  const prismaTx = tx || prismaClient;
  const verificationToken = await prismaTx.verificationToken.create({
    data: {
      email: data.email,
      token: data.token,
      expiresAt: data.expiresAt,
    },
  });

  return verificationToken;
};
