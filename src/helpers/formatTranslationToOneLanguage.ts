import type { LanguageCode } from "@prisma/client";

import type {
  findAllRestaurants,
  findRestaurantById,
} from "~/server/api/restaurant/restaurant.service";

export type RestaurantWithDetails = ReturnType<
  typeof formatTranslationToOneLanguageWithDetails
>;
export type Restaurant = ReturnType<typeof formatTranslationsToOneLanguage>;

export const formatTranslationToOneLanguageWithDetails = (
  restaurant: Awaited<ReturnType<typeof findRestaurantById>>,
  locale: LanguageCode
) => {
  return {
    ...restaurant,
    restaurantI18N:
      restaurant.restaurantI18N[locale] ||
      // TODO: REPLACE IT WITH DEFAULT LANGUAGE
      restaurant.restaurantI18N[
        Object.keys(restaurant.restaurantI18N)[0] as LanguageCode
      ],
    category: restaurant.category?.map((category) => ({
      ...category,
      categoryI18N:
        category.categoryI18N?.[locale] ||
        category.categoryI18N[
          Object.keys(category.categoryI18N)[0] as LanguageCode
        ],
    })),
    product: restaurant.product?.map((product) => ({
      ...product,
      productI18N:
        product.productI18N?.[locale] ||
        product.productI18N[
          Object.keys(product.productI18N)[0] as LanguageCode
        ],
    })),
  };
};

export const formatTranslationsToOneLanguage = (
  restaurants: Awaited<ReturnType<typeof findAllRestaurants>>,
  locale?: LanguageCode
) => {
  return restaurants.map((restaurant) => ({
    ...restaurant,
    restaurantI18N:
      locale && restaurant.restaurantI18N[locale]
        ? restaurant.restaurantI18N[locale]
        : restaurant.restaurantI18N[
            Object.keys(restaurant.restaurantI18N)[0] as LanguageCode
          ],
  }));
};
