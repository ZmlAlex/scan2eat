"use client";

import { type RestaurantLanguage } from "@prisma/client";
import { useLocale } from "next-intl";
import React from "react";

import { Icons } from "~/components/Icons";
import { Button } from "~/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/DropdownMenu";
import { locales } from "~/libs/nextIntl/navigation";
import { Link, usePathname } from "~/libs/nextIntl/navigation";

type Props = {
  languages?: Pick<RestaurantLanguage, "languageCode">[];
};

const DEFAULT_LANGUAGES = locales.map((locale) => ({
  languageCode: locale,
}));

export function LanguageToggle({ languages = DEFAULT_LANGUAGES }: Props) {
  const pathname = usePathname();
  const locale = useLocale();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 px-0">
          <Icons.languages />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <Link
            key={language.languageCode}
            href={pathname}
            locale={language.languageCode}
          >
            <DropdownMenuCheckboxItem
              className="capitalize"
              checked={language.languageCode === locale}
              key={language.languageCode}
            >
              {language.languageCode}
            </DropdownMenuCheckboxItem>
          </Link>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
