import type { LanguageCode } from "@prisma/client";
import { parseCookies, setCookie } from "nookies";

import { api } from "~/utils/api";
import { formatTranslationToOneLanguageWithDetails } from "~/utils/formatTranslationToOneLanguage";

const useGetRestaurant = (restaurantId: string) => {
  //TODO: THINK ABOUT CACHE?
  return api.restaurant.getRestaurant.useQuery(
    {
      restaurantId,
    },
    {
      cacheTime: 5000,
      enabled: Boolean(restaurantId),
      select: (restaurant) => {
        const defaultLanguage = restaurant.restaurantLanguage[0]?.languageCode;
        const { selectedRestaurantLang } = parseCookies();

        if (!selectedRestaurantLang && defaultLanguage) {
          setCookie(null, "selectedRestaurantLang", defaultLanguage, {
            maxAge: 30 * 24 * 60 * 60,
            path: "/",
          });
        }
        return formatTranslationToOneLanguageWithDetails(
          restaurant,
          // TODO: FIX WITH DEFAULT VALUE
          (selectedRestaurantLang || defaultLanguage) as LanguageCode
        );
      },
    }
  );
};

export default useGetRestaurant;
