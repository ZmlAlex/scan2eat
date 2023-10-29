import type { GetStaticPropsContext } from "next";

// TODO: TEMPORARY SOLUTION. REPLACE WITH APP FOLDER
export async function getStaticPropsWithLanguage({
  locale,
}: GetStaticPropsContext) {
  return {
    props: {
      messages: (await import(
        `~/lang/${locale as string}.json`
      )) as IntlMessages,
    },
  };
}