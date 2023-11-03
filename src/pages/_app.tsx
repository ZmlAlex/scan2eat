export { reportWebVitals } from "next-axiom";
import "~/styles/globals.css";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Analytics } from "@vercel/analytics/react";
import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AbstractIntlMessages, NextIntlProvider } from "next-intl";

import { DefaultSeo } from "~/components/DefaultSeo";
import { ThemeProvider } from "~/components/ThemeProvider";
import { Toaster } from "~/components/ui/Toaster";
import { api } from "~/helpers/api";

const MyApp: AppType<{
  messages?: AbstractIntlMessages;
  session: Session | null;
}> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider session={session}>
        <NextIntlProvider messages={pageProps.messages}>
          {/* helpers */}
          <DefaultSeo />
          <Toaster />
          <Analytics />
          <ReactQueryDevtools initialIsOpen={false} />
          {/* helpers */}

          <Component {...pageProps} />
        </NextIntlProvider>
      </SessionProvider>
    </ThemeProvider>
  );
};

export default api.withTRPC(MyApp);
