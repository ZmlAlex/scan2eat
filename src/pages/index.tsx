import { type NextPage } from "next";
import { NextSeo } from "next-seo";

import Features from "~/components/LandingSections/Features";
import Hero from "~/components/LandingSections/Hero";
import MarketingLayout from "~/layouts/Marketing.layout";

const Home: NextPage = () => {
  return (
    <>
      <NextSeo
        title="FoodMate - Digital menu generator"
        description="Manage your digital menu in the personal dashboard in an easy, let your customers view the menu on their own device, without any app installation."
      />

      <MarketingLayout>
        <Hero />
        <Features />
      </MarketingLayout>
    </>
  );
};

export default Home;
