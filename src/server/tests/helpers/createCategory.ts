import type {
  CategoryTranslationField,
  RestaurantTranslationField,
} from "@prisma/client";

import type { CreateCategoryInput } from "~/server/api/category/category.schema";
import { prisma } from "~/server/db";
import { formatFieldsToTranslationTable } from "~/server/helpers/formatFieldsToTranslationTable";
import { transformTranslation } from "~/server/helpers/formatTranslation";

export const createCategory = async (
  input: CreateCategoryInput & { userId: string }
) => {
  const translations = formatFieldsToTranslationTable<CategoryTranslationField>(
    ["name"],
    input
  );

  const result = await prisma.category.create({
    data: {
      userId: input.userId,
      restaurantId: input.restaurantId,
      categoryI18N: {
        createMany: {
          data: translations,
        },
      },
    },
    include: {
      categoryI18N: {
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
    categoryI18N: transformTranslation<RestaurantTranslationField>(
      result.categoryI18N
    ),
  };
};
