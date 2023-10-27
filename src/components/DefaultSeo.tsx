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
      // TODO: add open graph
    />
  );
};
