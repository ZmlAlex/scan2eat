import { parseCookies, setCookie } from "nookies";
import React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/Select";
import { api } from "~/utils/api";
import { type RestaurantWithDetails } from "~/utils/formatTranslationToOneLanguage";

type Props = {
  restaurant: RestaurantWithDetails;
};

const RestaurantLanguageSelector = ({ restaurant }: Props) => {
  const trpcCtx = api.useContext();
  const { selectedRestaurantLang } = parseCookies();

  const handleLanguageChange = async (language: string) => {
    setCookie(null, "selectedRestaurantLang", language, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    //TODO: DO IT LOCALLY? WITH setData
    await trpcCtx.restaurant.getRestaurant.invalidate({
      restaurantId: restaurant.id,
    });
  };

  return (
    <Select
      onValueChange={handleLanguageChange}
      defaultValue={selectedRestaurantLang}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a language" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {restaurant.restaurantLanguage.map((language) => (
            <SelectItem
              key={language.languageCode}
              value={language.languageCode}
            >
              {language.languageCode}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default RestaurantLanguageSelector;
