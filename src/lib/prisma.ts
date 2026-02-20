import { PrismaClient } from "@prisma/client";

/**
 * Prisma singleton utility to prevent multiple instances 
 * of the client during development in Next.js.
 * Clinical justification: Reliable database connection for audit logs.
 */
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
