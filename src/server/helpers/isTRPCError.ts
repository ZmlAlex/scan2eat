import { TRPCError } from "@trpc/server";

export const isTRPCError = (error: unknown): error is TRPCError => {
  return error instanceof TRPCError;
};
