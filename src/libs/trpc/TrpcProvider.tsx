"use client";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { useTranslations } from "next-intl";
import { useState } from "react";
import superjson from "superjson";

import { toast } from "~/components/ui/useToast";
import { errorMapper } from "~/helpers/errorMapper";
import { isTRPCErrorClientError } from "~/helpers/isTRPCClientError";

import { clientApi } from "./client";

export const TrpcProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const t = useTranslations("ResponseErrorMessage");

  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          // https://tkdodo.eu/blog/react-query-error-handling#the-global-callbacks
          onError: (error) => {
            if (isTRPCErrorClientError(error) && error.message) {
              const errorMessage = errorMapper(error.message);

              toast({
                title: t(errorMessage),
                variant: "destructive",
              });
            }
          },
        }),
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: (failureCount) => failureCount < 3,
            staleTime: 1000 * 60 * 5, // 5 minutes
          },
        },
      })
  );

  const url = process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : "http://localhost:3000/api/trpc/";

  const [trpcClient] = useState(() =>
    clientApi.createClient({
      links: [
        loggerLink({
          enabled: () => true,
        }),
        httpBatchLink({
          url,
        }),
      ],
      transformer: superjson,
    })
  );

  return (
    <clientApi.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools />
      </QueryClientProvider>
    </clientApi.Provider>
  );
};
