import { env } from "~/env.mjs";

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
  name: "Scan2Eat",
  description: "Application which helps generate qr menu",
  url: "https://tx.shadcn.com",
  ogImage: "https://tx.shadcn.com/og.jpg",
  links: {
    twitter: "https://twitter.com/alexzml1",
    github: "https://github.com/shadcn/taxonomy",
    restaurantExample: `/restaurants/${env.NEXT_PUBLIC_RESTAURANT_EXAMPLE_ID}`,
  },
};
