import { type RestaurantLanguage } from "@prisma/client";
// todo REPLACE
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
  const { asPath, push, pathname, query, locale, reload } = useRouter();

  const handleClick = (locale: string) => async () => {
    await push({ pathname, query }, asPath, {
      locale,
    });

    // !TODO: It's a workaround solution for temp issue with locale reloading https://stackoverflow.com/questions/73274826/next-js-router-push-does-not-change-locale-in-url
    if (query.restaurantId) {
      reload();
    }
  };

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
            onClick={handleClick(language.languageCode)}
          >
            {language.languageCode}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
