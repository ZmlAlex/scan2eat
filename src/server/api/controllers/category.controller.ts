import type { CategoryI18N, CategoryTranslationField } from "@prisma/client";

import { createFieldTranslationsForAdditionalLanguages } from "~/server/helpers/createFieldTranslationsForAddtionalLanugages";

import type {
  CreateCategoryInput,
  DeleteCategorytInput,
  UpdateCategoryInput,
} from "../schemas/category.schema";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "../services/category.service";
import { findRestaurant } from "../services/restaurant.service";
import type { Context } from "../trpc";

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

  const restaurant = await findRestaurant(
    { menu: { some: { id: input.menuId } } },
    ctx.prisma
  );

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

  return await findRestaurant(
    { menu: { some: { id: input.menuId } } },
    ctx.prisma
  );
};

export const updateCategoryHandler = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: UpdateCategoryInput;
}) => {
  await updateCategory(input, ctx.prisma);

  return await findRestaurant(
    { menu: { some: { category: { some: { id: input.categoryId } } } } },
    ctx.prisma
  );
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

  return await findRestaurant(
    { menu: { some: { id: deletedCategory.menuId } } },
    ctx.prisma
  );
};
