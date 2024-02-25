import { NextIntlClientProvider, useMessages } from "next-intl";

export default function NextIntlProvider({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  const messages = useMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={{ ...messages }}>
      {children}
    </NextIntlClientProvider>
  );
}
