import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { Toaster } from "~/components/ui/Toaster";
import NextAuthSessionProvider from "~/libs/nextAuth/NextAuthSessionProvider";
import NextIntlProvider from "~/libs/nextIntl/NextIntlProvider";
import { ThemeProvider } from "~/libs/nextTheme/NextThemeProvider";
import { TrpcProvider } from "~/libs/trpc/TrpcProvider";

const ProvidersWrapper = ({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) => {
  return (
    <NextIntlProvider locale={locale}>
      <TrpcProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextAuthSessionProvider>
            <Toaster />
            <ReactQueryDevtools initialIsOpen={false} />
            {children}
          </NextAuthSessionProvider>
        </ThemeProvider>
      </TrpcProvider>
    </NextIntlProvider>
  );
};

export default ProvidersWrapper;
