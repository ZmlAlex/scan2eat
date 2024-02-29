import "../../styles/globals.css";

import { type LanguageCode } from "@prisma/client";
import { type Metadata } from "next";
import { getTranslator } from "next-intl/server";

import ProvidersWrapper from "~/components/ProvidersWrapper";

type MetadataProps = {
  params: { locale: LanguageCode };
};

export async function generateMetadata({
  params,
}: MetadataProps): Promise<Metadata> {
  const { locale } = params;

  const t = await getTranslator(locale);

  return {
    title: t("SEO.default.title"),
    description: t("SEO.default.description"),
    keywords: ["qr-menu", "menu", "restaurant"],
  };
}

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
