import type { NextPage } from "next";
import { useTranslations } from "next-intl";

import { siteConfig } from "~/config/site";
import { getStaticPropsWithLanguage } from "~/helpers/getStaticPropsWithLanguage";
import { MarketingLayout } from "~/layouts/Marketing.layout";

const PARAGRAPH_KEYS = [
  "informationCollectionAndUse",
  "informationProtection",
  "cookies",
  "disclosuretoThirdParties",
  "yourConsent",
  "changesToOurPrivacyPolicy",
  "contactUs",
] as const;

const PrivacyPolicyPage: NextPage = () => {
  const t = useTranslations("Page.privacyPolicy");

  return (
    <MarketingLayout>
      <div className="container">
        <h1 className="mb-4 text-xl font-bold">{t("title")}</h1>
        <p className="mb-2">{t("lastUpdated")}</p>
        <p className="mb-4 text-muted-foreground">{t("description")}</p>
        {PARAGRAPH_KEYS.map((key) => (
          <>
            <h2 className="mb-2 text-xl font-medium ">
              {t(`paragraphs.${key}.title`)}
            </h2>
            <p className="mb-4 text-muted-foreground">
              {t(`paragraphs.${key}.description`)}
            </p>
            {key === "contactUs" && (
              <a className="hover:underline" href={siteConfig.links.twitter}>
                {siteConfig.links.twitter}
              </a>
            )}
          </>
        ))}
      </div>
    </MarketingLayout>
  );
};

export const getStaticProps = getStaticPropsWithLanguage;

export default PrivacyPolicyPage;
