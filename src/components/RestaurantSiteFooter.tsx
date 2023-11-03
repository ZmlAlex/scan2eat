import Link from "next/link";
import { useTranslations } from "next-intl";
import React from "react";

import { cn } from "~/helpers/cn";

export function RestaurantSiteFooter({
  className,
}: React.HTMLAttributes<HTMLElement>) {
  const t = useTranslations("Footer.restaurant");

  return (
    <footer className={cn("bg-slate-50 dark:bg-transparent", className)}>
      <div className="container py-4">
        <p className="text-center text-xs font-semibold">
          {t("title")}
          <Link className="hover:underline" href="/">
            Scan2Eat
          </Link>
        </p>
      </div>
    </footer>
  );
}
