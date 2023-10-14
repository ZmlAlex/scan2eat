import type { CategoryI18N, CategoryTranslationField } from "@prisma/client";
import { TRPCError } from "@trpc/server";

import { MAX_CATEGORIES_PER_RESTAURANT } from "~/config/limitations";
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
  updateManyCategoriesPositions,
} from "~/server/api/services/category.service";
import { findRestaurantById } from "~/server/api/services/restaurant.service";
import type { ProtectedContext } from "~/server/api/trpc";
import { createFieldTranslationsForAdditionalLanguages } from "~/server/helpers/createFieldTranslationsForAddtionalLanugages";
import { baseErrorMessage } from "~/utils/errorMapper";

export const createCategoryHandler = async ({
  ctx,
  input,
}: {
  ctx: ProtectedContext;
  input: CreateCategoryInput;
}) => {
  let additionalTranslations: Pick<
    CategoryI18N,
    "fieldName" | "languageCode" | "translation"
  >[] = [];
  const userId = ctx.session.user.id;

  const restaurant = await findRestaurantById(input.restaurantId, ctx.prisma);

  if (restaurant.category.length >= MAX_CATEGORIES_PER_RESTAURANT) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: baseErrorMessage.ReachedCategoriesLimit,
    });
  }

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

  await createCategory(
    { ...input, userId },
    additionalTranslations,
    ctx.prisma
  );

  return findRestaurantById(input.restaurantId, ctx.prisma);
};

export const updateCategoryHandler = async ({
  ctx,
  input,
}: {
  ctx: ProtectedContext;
  input: UpdateCategoryInput;
}) => {
  const userId = ctx.session.user.id;

  await updateCategory({ ...input, userId }, ctx.prisma);
  return findRestaurantById(input.restaurantId, ctx.prisma);
};

export const updateCategoriesPositionHandler = async ({
  ctx,
  input,
}: {
  ctx: ProtectedContext;
  input: UpdateCategoriesPositionInput;
}) => {
  const userId = ctx.session.user.id;

  const [updatedCategory] = await updateManyCategoriesPositions(
    input,
    userId,
    ctx.prisma
  );

  return findRestaurantById(updatedCategory?.restaurantId ?? "", ctx.prisma);
};

export const deleteCategoryHandler = async ({
  ctx,
  input,
}: {
  ctx: ProtectedContext;
  input: DeleteCategorytInput;
}) => {
  const userId = ctx.session.user.id;

  const deletedCategory = await deleteCategory(
    { id: input.categoryId, userId },
    ctx.prisma
  );

  return findRestaurantById(deletedCategory.restaurantId, ctx.prisma);
};
