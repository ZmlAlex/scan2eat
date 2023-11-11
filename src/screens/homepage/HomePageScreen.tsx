import { Features } from "~/components/LandingSections/Features";
import { Hero } from "~/components/LandingSections/Hero";
import { MarketingLayout } from "~/layouts/Marketing.layout";

export const HomePageScreen = () => {
  return (
    <MarketingLayout>
      <Hero />
      <Features />
    </MarketingLayout>
  );
};
