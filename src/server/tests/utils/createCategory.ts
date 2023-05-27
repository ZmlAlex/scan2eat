import type {
  CategoryTranslationField,
  RestaurantTranslationField,
} from "@prisma/client";
import { prisma } from "~/server/db";
import { formatFieldsToTranslationTable } from "~/server/helpers/formatFieldsToTranslationTable";
import { transformTranslation } from "~/server/helpers/formatTranslation";
import type { CreateCategoryInput } from "~/server/api/schemas/category.schema";

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
        },
      },
    },
  });

  return {
    ...result,
    ...transformTranslation<RestaurantTranslationField>(result.categoryI18N),
  };
};
