import type { LanguageCode } from "@prisma/client";
import { parseCookies, setCookie } from "nookies";

import { formatTranslationToOneLanguageWithDetails } from "~/helpers/formatTranslationToOneLanguage";
import { api } from "~/libs/api";

export const useGetRestaurant = (restaurantId: string) => {
  return api.restaurant.getRestaurant.useQuery(
    {
      restaurantId,
    },
    {
      enabled: Boolean(restaurantId),
      select: (restaurant) => {
        const defaultLanguage = restaurant.restaurantLanguage[0]?.languageCode;
        const cookies = parseCookies();
        const selectedRestaurantLang =
          cookies[`selectedRestaurantLang${restaurantId}`];

        if (!selectedRestaurantLang && defaultLanguage) {
          setCookie(
            null,
            `selectedRestaurantLang${restaurantId}`,
            defaultLanguage,
            {
              maxAge: 30 * 24 * 60 * 60,
              path: "/",
            }
          );
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
