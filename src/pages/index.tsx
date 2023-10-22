import type { NextPage } from "next";

import Features from "~/components/LandingSections/Features";
import Hero from "~/components/LandingSections/Hero";
import { getServerSidePropsWithLanguage } from "~/helpers/getServerSidePropsWithLanguage";
import MarketingLayout from "~/layouts/Marketing.layout";

const HomePage: NextPage = () => {
  return (
    <MarketingLayout>
      <Hero />
      <Features />
    </MarketingLayout>
  );
};

export const getServerSideProps = getServerSidePropsWithLanguage;

export default HomePage;
