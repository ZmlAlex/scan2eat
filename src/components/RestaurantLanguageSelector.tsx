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
import { api } from "~/helpers/api";
import { type RestaurantWithDetails } from "~/helpers/formatTranslationToOneLanguage";

type Props = {
  restaurant: RestaurantWithDetails;
};

export const RestaurantLanguageSelector = ({ restaurant }: Props) => {
  const cookies = parseCookies();
  const selectedRestaurantLang =
    cookies[`selectedRestaurantLang${restaurant.id}`];

  const trpcContext = api.useContext();

  const handleLanguageChange = async (language: string) => {
    setCookie(null, `selectedRestaurantLang${restaurant.id}`, language, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    //TODO: DO IT LOCALLY? WITH setData
    await trpcContext.restaurant.getRestaurant.invalidate({
      restaurantId: restaurant.id,
    });
  };

  return (
    <Select
      onValueChange={handleLanguageChange}
      defaultValue={selectedRestaurantLang}
    >
      <SelectTrigger className="w-fit capitalize">
        <SelectValue placeholder="Select a language" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {restaurant.restaurantLanguage.map((language) => (
            <SelectItem
              className="capitalize"
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
