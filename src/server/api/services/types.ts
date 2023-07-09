import type { PrismaClient } from "@prisma/client";

//TODO: THINK ABOUT BEST PLACE FOR TYPES
export type PrismaTransactionClient = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use"
>;
