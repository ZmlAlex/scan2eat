import type { RestaurantTranslationField } from "@prisma/client";

import type { CreateRestaurantInput } from "~/server/api/schemas/restaurant.schema";
import { prisma } from "~/server/db";
import { formatFieldsToTranslationTable } from "~/server/helpers/formatFieldsToTranslationTable";
import { transformTranslation } from "~/server/helpers/formatTranslation";

export const createRestaurantWithMultipleLanguages = async (
  userId: string,
  input: CreateRestaurantInput & { logoUrl: string }
) => {
  const translations =
    formatFieldsToTranslationTable<RestaurantTranslationField>(
      ["name", "description", "address"],
      input
    );

  const additionalTranslations =
    formatFieldsToTranslationTable<RestaurantTranslationField>(
      ["name", "description", "address"],
      {
        languageCode: "russian",
        name: "текст на русском",
        description: "текст на русском",
      }
    );

  const result = await prisma.restaurant.create({
    data: {
      userId: userId,
      workingHours: input.workingHours,
      logoUrl: input.logoUrl,
      currencyCode: input.currencyCode,
      menu: {
        create: {},
      },
      restaurantLanguage: {
        createMany: {
          data: [
            { languageCode: input.languageCode },
            { languageCode: "russian" },
          ],
        },
      },
      restaurantI18N: {
        createMany: {
          data: [...translations, ...additionalTranslations],
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
      menu: { select: { id: true } },
    },
  });

  return {
    ...result,
    restaurantI18N: transformTranslation<RestaurantTranslationField>(
      result.restaurantI18N
    ),
  };
};
