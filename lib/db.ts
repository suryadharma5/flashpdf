import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient;
}

export const prismaClient =
  globalThis.prisma ||
  new PrismaClient({
    transactionOptions: {
      maxWait: 5000,
      timeout: 10000,
    },
  });

if (process.env.NODE_ENV !== "production") globalThis.prisma = prismaClient;
