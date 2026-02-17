import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// In development, always create a new client to pick up schema changes
// In production, use the cached client for performance
export const db = process.env.NODE_ENV === 'production' 
  ? (globalForPrisma.prisma ?? new PrismaClient())
  : new PrismaClient()

if (process.env.NODE_ENV === 'production') globalForPrisma.prisma = db
