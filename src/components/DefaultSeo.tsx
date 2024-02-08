// TODO: REPLACE
import { useRouter } from "next/router";
import { DefaultSeo as DefautlSeoNext } from "next-seo";

import { getLanguageTranslationJSON } from "~/helpers/getLanguageTranslateJSON";

export const DefaultSeo = () => {
  const { locale } = useRouter();
  const lang = getLanguageTranslationJSON(locale as string);

  return (
    <DefautlSeoNext
      title={lang.SEO.default.title}
      description={lang.SEO.default.description}
      additionalLinkTags={[
        {
          rel: "icon",
          href: `/images/favicon.ico`,
        },
        {
          rel: "icon",
          href: `/images/favicon-16x16.png`,
          sizes: "16x16",
        },
        {
          rel: "icon",
          href: `/images/favicon-32x32.png`,
          sizes: "32x32",
        },
        {
          rel: "apple-touch-icon",
          href: "images/touch-icon-ipad.jpg",
          sizes: "76x76",
        },
      ]}
      // TODO: add open graph
    />
  );
};
