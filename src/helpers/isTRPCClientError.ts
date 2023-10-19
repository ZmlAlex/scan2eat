import { TRPCClientError } from "@trpc/client";

import type { AppRouter } from "~/server/api/root";

export const isTRPCErrorClientError = (
  error: unknown
): error is TRPCClientError<AppRouter> => {
  return error instanceof TRPCClientError;
};
