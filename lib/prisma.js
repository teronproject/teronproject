import { PrismaClient } from "@prisma/client";

/**
 * Prisma Client singleton.
 * In serverless environments (Vercel), we store the client on `globalThis` to prevent
 * creating new instances and connection pools across warm lambda invocations.
 */

const globalForPrisma = globalThis;

function createPrismaClient() {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
  });
}

const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
