import { PrismaClient } from "@prisma/client";

/**
 * Prisma Client singleton.
 * In development, we store the client on `globalThis` to prevent
 * multiple instances from being created during hot-reloading.
 */

const globalForPrisma = globalThis;

function createPrismaClient() {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

// In dev, if cached client doesn't have recently generated models (e.g. terrWithdrawal), re-instantiate it
const prisma =
  globalForPrisma.prisma?.terrWithdrawal
    ? globalForPrisma.prisma
    : createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
