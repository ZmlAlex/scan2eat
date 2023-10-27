import type { GetServerSidePropsContext } from "next";

// TODO: TEMPORARY SOLUTION. REPLACE WITH APP FOLDER
export async function getServerSidePropsWithLanguage({
  locale,
}: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(
        `~/lang/${locale as string}.json`
      )) as IntlMessages,
    },
  };
}
