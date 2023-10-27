import type { NextPage } from "next";

import { Features } from "~/components/LandingSections/Features";
import { Hero } from "~/components/LandingSections/Hero";
import { getStaticPropsWithLanguage } from "~/helpers/getStaticPropsWithLanguage";
import { MarketingLayout } from "~/layouts/Marketing.layout";

const HomePage: NextPage = () => {
  return (
    <MarketingLayout>
      <Hero />
      <Features />
    </MarketingLayout>
  );
};

export const getStaticProps = getStaticPropsWithLanguage;

export default HomePage;
