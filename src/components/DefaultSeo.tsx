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
          href: `/favicon.ico`,
        },
        {
          rel: "apple-touch-icon",
          href: "/touch-icon-ipad.jpg",
          sizes: "76x76",
        },
      ]}
      // TODO: add open graph
    />
  );
};
