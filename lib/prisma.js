import { PrismaClient } from "@prisma/client";

/**
 * Prisma Client singleton.
 * In development, we store the client on `globalThis` to prevent
 * multiple instances from being created during hot-reloading.
 */

const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
