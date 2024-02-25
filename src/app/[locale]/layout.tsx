import "../../styles/globals.css";

import ProvidersWrapper from "~/components/ProvidersWrapper";

// TODO: HANDLE METADATA
export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    // TODO: HANDLE LOCALE
    <html lang="en">
      <body>
        <ProvidersWrapper locale={locale}>{children}</ProvidersWrapper>
      </body>
    </html>
  );
}
