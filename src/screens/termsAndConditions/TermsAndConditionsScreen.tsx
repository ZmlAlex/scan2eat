import { useTranslations } from "next-intl";

import { siteConfig } from "~/config/site";
import { MarketingLayout } from "~/layouts/Marketing.layout";

const PARAGRAPH_KEYS = [
  "agreementToTerms",
  "userRepresentations",
  "userRegistration",
  "prohibitedActivities",
  "governingLaw",
  "changesToOurPrivacyPolicy",
  "contactUs",
] as const;

export const TermsAndConditionsScreen = () => {
  const t = useTranslations("Page.termsAndConditions");

  return (
    <MarketingLayout>
      <div className="container">
        <h1 className="mb-4 text-xl font-bold">{t("title")}</h1>
        <p className="mb-2">{t("lastUpdated")}</p>
        {PARAGRAPH_KEYS.map((key) => (
          <>
            <h2 className="mb-2 text-xl font-semibold">
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
