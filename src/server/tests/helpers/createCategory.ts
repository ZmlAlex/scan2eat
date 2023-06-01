import type {
  CategoryTranslationField,
  RestaurantTranslationField,
} from "@prisma/client";

import type { CreateCategoryInput } from "~/server/api/schemas/category.schema";
import { prisma } from "~/server/db";
import { formatFieldsToTranslationTable } from "~/server/helpers/formatFieldsToTranslationTable";
import { transformTranslation } from "~/server/helpers/formatTranslation";

export const createCategory = async (input: CreateCategoryInput) => {
  const translations = formatFieldsToTranslationTable<CategoryTranslationField>(
    ["name"],
    input
  );

  const result = await prisma.category.create({
    data: {
      menuId: input.menuId,
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
