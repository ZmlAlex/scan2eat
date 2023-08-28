import type { CategoryI18N, CategoryTranslationField } from "@prisma/client";

import type {
  CreateCategoryInput,
  DeleteCategorytInput,
  UpdateCategoriesPositionInput,
  UpdateCategoryInput,
} from "~/server/api/schemas/category.schema";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "~/server/api/services/category.service";
import { findRestaurantById } from "~/server/api/services/restaurant.service";
import type { Context } from "~/server/api/trpc";
import { createFieldTranslationsForAdditionalLanguages } from "~/server/helpers/createFieldTranslationsForAddtionalLanugages";

export const createCategoryHandler = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: CreateCategoryInput;
}) => {
  let additionalTranslations: Pick<
    CategoryI18N,
    "fieldName" | "languageCode" | "translation"
  >[] = [];

  const restaurant = await findRestaurantById(input.restaurantId, ctx.prisma);

  if (restaurant.restaurantLanguage.length > 1) {
    additionalTranslations =
      await createFieldTranslationsForAdditionalLanguages<CategoryTranslationField>(
        {
          sourceLanguage: input.languageCode,
          restaurantLanguages: restaurant.restaurantLanguage,
          fieldsForTranslation: [["name", input.name]],
        }
      );
  }

  await createCategory(input, additionalTranslations, ctx.prisma);

  return findRestaurantById(input.restaurantId, ctx.prisma);
};

export const updateCategoryHandler = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: UpdateCategoryInput;
}) => {
  await updateCategory(input, ctx.prisma);
  return findRestaurantById(input.restaurantId, ctx.prisma);
};

export const updateCategoriesPositionHandler = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: UpdateCategoriesPositionInput;
}) => {
  // TODO: MOVE TO THE SERVICE?
  const [updatedCategory] = await ctx.prisma.$transaction(
    input.map((item) =>
      ctx.prisma.category.update({
        data: { position: item.position },
        where: { id: item.id },
      })
    )
  );

  return findRestaurantById(updatedCategory?.restaurantId ?? "", ctx.prisma);
};

export const deleteCategoryHandler = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: DeleteCategorytInput;
}) => {
  const deletedCategory = await deleteCategory(
    { id: input.categoryId },
    ctx.prisma
  );

  return findRestaurantById(deletedCategory.restaurantId, ctx.prisma);
};
