import { type RestaurantLanguage } from "@prisma/client";
import { useRouter } from "next/router";
import React from "react";

import { Icons } from "~/components/Icons";
import { Button } from "~/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/DropdownMenu";

type Props = {
  languages: Pick<RestaurantLanguage, "languageCode">[];
};

export function LanguageToggle({ languages }: Props) {
  const { asPath, push, pathname, query, locale } = useRouter();

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
          <DropdownMenuCheckboxItem
            className="capitalize"
            checked={language.languageCode === locale}
            key={language.languageCode}
            onClick={() =>
              push({ pathname, query }, asPath, {
                locale: language.languageCode,
              })
            }
          >
            {language.languageCode}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
