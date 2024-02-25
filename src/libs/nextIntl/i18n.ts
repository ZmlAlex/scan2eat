import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

import { type Locale, locales } from "./navigation";

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) notFound();

  return {
    messages: (await import(
      `~/libs/nextIntl/languages/${locale}.json`
    )) as IntlMessages,
  };
});
