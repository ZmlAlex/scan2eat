import type { NextPage } from "next";
import { useTranslations } from "next-intl";
import { NextSeo } from "next-seo";

import Features from "~/components/LandingSections/Features";
import Hero from "~/components/LandingSections/Hero";
import { getServerSidePropsWithLanguage } from "~/helpers/getServerSidePropsWithLanguage";
import MarketingLayout from "~/layouts/Marketing.layout";

const HomePage: NextPage = () => {
  const t = useTranslations("SEO.homePage");
  return (
    <>
      <NextSeo title={t("title")} description={t("description")} />

      <MarketingLayout>
        <Hero />
        <Features />
      </MarketingLayout>
    </>
  );
};

export const getServerSideProps = getServerSidePropsWithLanguage;

export default HomePage;
