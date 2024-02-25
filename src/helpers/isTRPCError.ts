import { TRPCError } from "@trpc/server";

/**  Use it for the getServerSideProps and .etc to handle errors in the catch block. */
export const isTRPCError = (error: unknown): error is TRPCError => {
  return error instanceof TRPCError;
};
