import { PrismaClient } from '../../generated/prisma';

declare global {
  // eslint-disable-next-line no-var
  var __guidly_prisma__: PrismaClient | undefined;
}

export function getPrismaClient(): PrismaClient {
  if (!global.__guidly_prisma__) {
    global.__guidly_prisma__ = new PrismaClient();
  }
  return global.__guidly_prisma__;
}


