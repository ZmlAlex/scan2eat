import type { RestaurantTranslationField } from "@prisma/client";
import { prisma } from "~/server/db";
import { formatFieldsToTranslationTable } from "~/server/helpers/formatFieldsToTranslationTable";
import { transformTranslation } from "~/server/helpers/formatTranslation";
import type { CreateRestaurantInput } from "~/server/api/schemas/restaurant.schema";

export const createRestaurant = async (
  userId: string,
  input: CreateRestaurantInput
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
      menu: {
        create: {},
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
        },
      },
    },
  });

  return {
    ...result,
    ...transformTranslation<RestaurantTranslationField>(result.restaurantI18N),
  };
};
