import { getBaseUrl } from "~/utils/api";

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    twitter: string;
    github: string;
    restaurantExample: string;
  };
};

export const siteConfig: SiteConfig = {
  name: "FoodMate",
  description: "Application which helps generate qr menu",
  url: "https://tx.shadcn.com",
  ogImage: "https://tx.shadcn.com/og.jpg",
  links: {
    twitter: "https://twitter.com/shadcn",
    github: "https://github.com/shadcn/taxonomy",
    restaurantExample:
      process.env.NODE_ENV === "production"
        ? "/restaurants/clm3noiqw00013sl3rd9sbk5h"
        : "/restaurants/clm3eehzm00013s1rlfw49y38",
  },
};
