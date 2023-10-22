/**
 * This is the client-side entrypoint for your tRPC API. It is used to create the `api` object which
 * contains the Next.js App-wrapper, as well as your type-safe React Query hooks.
 *
 * We also create a few inference helpers for input and output types.
 */
import { QueryCache, QueryClient } from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import superjson from "superjson";

import { toast } from "~/components/ui/useToast";
import { errorMapper } from "~/helpers/errorMapper";
import { getLanguageTranslationJSON } from "~/helpers/getLanguageTranslateJSON";
import { isTRPCErrorClientError } from "~/helpers/isTRPCClientError";
import { type AppRouter } from "~/server/api/root";

export const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};
/** A set of type-safe react-query hooks for your tRPC API. */
export const api = createTRPCNext<AppRouter>({
  config() {
    return {
      queryClient: new QueryClient({
        queryCache: new QueryCache({
          // https://tkdodo.eu/blog/react-query-error-handling#the-global-callbacks
          onError: (error, _query) => {
            if (isTRPCErrorClientError(error) && error.message) {
              const translations = getLanguageTranslationJSON(
                window.location.pathname
              );
              const errorMessage = errorMapper(error.message);

              toast({
                title: translations.ResponseErrorMessage[errorMessage],
                variant: "destructive",
              });
            }
          },
        }),
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: (failureCount) => failureCount < 3,
          },
        },
      }),
      /**
       * Transformer used for data de-serialization from the server.
       *
       * @see https://trpc.io/docs/data-transformers
       */
      transformer: superjson,

      /**
       * Links used to determine request flow from client to server.
       *
       * @see https://trpc.io/docs/links
       */
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    };
  },
  /**
   * Whether tRPC should await queries when server rendering pages.
   *
   * @see https://trpc.io/docs/nextjs#ssr-boolean-default-false
   */
  ssr: false,
});

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;
