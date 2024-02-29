import type { RestaurantTranslationField } from "@prisma/client";

import type { CreateRestaurantInput } from "~/server/api/restaurant/restaurant.schema";
import { prisma } from "~/server/db";
import { formatFieldsToTranslationTable } from "~/server/helpers/formatFieldsToTranslationTable";
import { transformTranslation } from "~/server/helpers/formatTranslation";

export const createRestaurant = async (
  userId: string,
  input: Omit<CreateRestaurantInput, "logoImageBase64"> & { logoUrl: string }
) => {
  const translations =
    formatFieldsToTranslationTable<RestaurantTranslationField>(
      ["name", "description", "address"],
      input
    );

  const result = await prisma.restaurant.create({
    data: {
      userId: userId,
      workingHours: input.workingHours,
      logoUrl: input.logoUrl,
      currencyCode: input.currencyCode,
      restaurantLanguage: {
        create: {
          languageCode: input.languageCode,
        },
      },
      restaurantI18N: {
        createMany: {
          data: translations,
        },
      },
    },
    include: {
      restaurantI18N: {
        select: {
          fieldName: true,
          translation: true,
          languageCode: true,
        },
      },
    },
  });

  return {
    ...result,
    restaurantI18N: transformTranslation<RestaurantTranslationField>(
      result.restaurantI18N
    ),
  };
};
