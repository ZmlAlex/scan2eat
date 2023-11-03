import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";
import React from "react";

import { buttonVariants } from "~/components/ui/Button";
import { siteConfig } from "~/config/site";
import { cn } from "~/helpers/cn";

const foodPlaces = [
  {
    id: 1,
    content: "title.secondLineRestaurant",
  },
  {
    id: 2,
    content: "title.secondLineCafe",
  },
  {
    id: 3,
    content: "title.secondLineBar",
  },
] as const;

export const Hero = () => {
  const [index, setIndex] = React.useState(0);

  const t = useTranslations("Landing.hero");

  React.useEffect(() => {
    const id = setInterval(() => {
      setIndex((state) => {
        if (state >= foodPlaces.length - 1) return 0;
        return state + 1;
      });
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <AnimatePresence>
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <Link
            href={siteConfig.links.twitter}
            className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium"
            target="_blank"
          >
            {t("twitterLabel")}
          </Link>
          <h1 className="font-heading text-3xl font-medium sm:text-5xl md:text-6xl lg:text-7xl">
            {t("title.firstLine")}
            <motion.div
              key={foodPlaces[index]?.id}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {t(foodPlaces[index]?.content ?? "title.secondLineBar")}
            </motion.div>
            {t("title.thirdLine")}
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            {t("description")}
          </p>

          <div className="flex gap-4">
            <Link
              href="/login"
              className={cn(buttonVariants({ size: "default" }))}
            >
              {t("primaryButtonLabel")}
            </Link>
            <Link
              href={siteConfig.links.restaurantExample}
              target="_blank"
              className={cn(
                buttonVariants({ variant: "secondary", size: "default" })
              )}
            >
              {t("secondayButtonLabel")}
            </Link>
          </div>
        </div>
      </section>
    </AnimatePresence>
  );
};
