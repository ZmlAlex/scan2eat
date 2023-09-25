import "~/styles/globals.css";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Analytics } from "@vercel/analytics/react";
import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AbstractIntlMessages, NextIntlProvider } from "next-intl";

import { ThemeProvider } from "~/components/ThemeProvider";
import { Toaster } from "~/components/ui/Toaster";
import { api } from "~/utils/api";

const MyApp: AppType<{
  messages?: AbstractIntlMessages;
  session: Session | null;
}> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider session={session}>
        <NextIntlProvider messages={pageProps.messages}>
          <Component {...pageProps} />
          <Toaster />
        </NextIntlProvider>
        <ReactQueryDevtools initialIsOpen={false} />
        <Analytics />
      </SessionProvider>
    </ThemeProvider>
  );
};

export default api.withTRPC(MyApp);
