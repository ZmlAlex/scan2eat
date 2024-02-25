import Link from "next/link";
import { useTranslations } from "next-intl";
import React from "react";

import { cn } from "~/libs/cn";

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  const t = useTranslations("Footer.general");
  return (
    <footer className={cn(className)}>
      <div className="container">
        <div className="flex gap-8 py-6 lg:py-8">
          <div>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="mb-4">
                <Link className="hover:underline" href="/privacy-policy">
                  {t("privacyPolicyLabel")}
                </Link>
              </li>
              <li>
                <Link className="hover:underline" href="/terms-and-conditions">
                  {t("termsAndConditionsLabel")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
