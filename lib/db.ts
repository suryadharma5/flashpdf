import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient;
}

export const prismaClient =
  globalThis.prisma ||
  new PrismaClient({
    transactionOptions: {
      maxWait: 60000,
      timeout: 60000,
    },
  });

if (process.env.NODE_ENV !== "production") globalThis.prisma = prismaClient;
