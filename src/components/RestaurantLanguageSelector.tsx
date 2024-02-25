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
import { clientApi } from "~/libs/trpc/client";
import { useGetRestaurantWithUserCheck } from "~/libs/trpc/hooks/useGetRestaurantWithUserCheck";

export const RestaurantLanguageSelector = () => {
  const { data: restaurant } = useGetRestaurantWithUserCheck();

  const cookies = parseCookies();
  const selectedRestaurantLang =
    cookies[`selectedRestaurantLang${restaurant.id}`];
  const trpcContext = clientApi.useContext();

  const handleLanguageChange = (language: string) => {
    setCookie(null, `selectedRestaurantLang${restaurant.id}`, language, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    trpcContext.restaurant.getRestaurantWithUserCheck.setData(
      { restaurantId: restaurant.id },
      // make new object without reference connection in order to trigger invocation of "select" in useGetRestaurantWithUserCheck hook
      (restuarant) => structuredClone(restuarant)
    );
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
