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
        ? "/restaurants/clmaav1bs004t3s6wk7sxlxrz"
        : "/restaurants/clmaaf1wd004t3sa35fkallcm",
  },
};
