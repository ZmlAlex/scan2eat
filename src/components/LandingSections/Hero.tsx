import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import React from "react";

import { buttonVariants } from "~/components/ui/Button";
import { siteConfig } from "~/config/site";
import { cn } from "~/utils/cn";

const items = [
  {
    id: 1,
    content: "Restaurant",
  },
  {
    id: 2,
    content: "Cafe",
  },
  {
    id: 3,
    content: "Bar",
  },
];

const Hero = () => {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => {
      setIndex((state) => {
        if (state >= items.length - 1) return 0;
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
            href="#"
            className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium"
            target="_blank"
          >
            Follow along on Twitter
          </Link>
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            Create a QR menu for{" "}
            <motion.div
              key={items[index]?.id}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {items[index]?.content}
            </motion.div>
            in minutes.
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Want to create your QR menu without pain? With FoodMate, adding new
            menu is a breeze.
          </p>

          <div className="flex gap-4">
            <Link
              href="/login"
              className={cn(buttonVariants({ size: "default" }))}
            >
              Get Started
            </Link>
            <Link
              href={siteConfig.links.restaurantExample}
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ variant: "secondary", size: "default" })
              )}
            >
              See example
            </Link>
          </div>
        </div>
      </section>
    </AnimatePresence>
  );
};

export default Hero;
