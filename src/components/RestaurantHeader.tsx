import React from "react";

import { LanguageToggle } from "~/components/LanguageToggle";
import { ModeToggle } from "~/components/ModeToggle";
import type { RestaurantWithDetails } from "~/utils/formatTranslationToOneLanguage";

type Props = {
  name: string;
  restaurantLanguage: RestaurantWithDetails["restaurantLanguage"];
};

const RestaurantHeader = ({ name, restaurantLanguage }: Props) => {
  return (
    <div className="sticky top-0 z-40 flex h-[69px] items-center justify-between gap-x-4 bg-background py-3">
      <h1 className="font-heading text-[clamp(1rem,2vw+1rem,1.875rem)] font-bold trimmed-line-1">
        {name}
      </h1>

      <div className="ml-auto">
        <ModeToggle />
      </div>

      {restaurantLanguage.filter((language) => language.isEnabled).length >
        1 && <LanguageToggle languages={restaurantLanguage} />}
    </div>
  );
};

export default RestaurantHeader;
