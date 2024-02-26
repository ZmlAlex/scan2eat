import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";

import type { AppRouter } from "~/server/api/root";

/**  Use it with "use client" inside client components */
export const isTRPCClientError = (
  error: unknown
): error is TRPCClientError<AppRouter> => {
  return error instanceof TRPCClientError;
};

/**  Use it for the getServerSideProps and .etc to handle errors in the catch block. */
export const isTRPCServerError = (error: unknown): error is TRPCError => {
  return error instanceof TRPCError;
};
