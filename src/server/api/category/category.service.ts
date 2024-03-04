import type { CategoryI18N, CategoryTranslationField } from "@prisma/client";
import { TRPCError } from "@trpc/server";

import { MAX_CATEGORIES_PER_RESTAURANT } from "~/config/limitations";
import { baseErrorMessage } from "~/helpers/errorMapper";
import * as categoryRepository from "~/server/api/category/category.repository";
import type {
  CreateCategoryInput,
  DeleteCategorytInput,
  UpdateCategoriesPositionInput,
  UpdateCategoryInput,
} from "~/server/api/category/category.schema";
import * as restaurantRepository from "~/server/api/restaurant/restaurant.repository";
import type { ProtectedContext } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { createFieldTranslationsForAdditionalLanguages } from "~/server/helpers/createFieldTranslationsForAddtionalLanugages";
import { formatFieldsToTranslationTable } from "~/server/helpers/formatFieldsToTranslationTable";

export const createCategory = async ({
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

  const restaurant = await restaurantRepository.findRestaurantByIdAndUserId(
    { restaurantId: input.restaurantId, userId },
    prisma
  );

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

  const mainTranslation =
    formatFieldsToTranslationTable<CategoryTranslationField>(["name"], input);
  const translations = [...mainTranslation, ...additionalTranslations];

  await categoryRepository.createCategory(
    { ...input, userId },
    translations,
    prisma
  );
};

export const updateCategory = async ({
  ctx,
  input,
}: {
  ctx: ProtectedContext;
  input: UpdateCategoryInput;
}) => {
  const { autoTranslateEnabled, ...restInput } = input;
  const userId = ctx.session.user.id;
  let additionalTranslations: Pick<
    CategoryI18N,
    "fieldName" | "languageCode" | "translation"
  >[] = [];

  const restaurant = await restaurantRepository.findRestaurantByIdAndUserId(
    { restaurantId: input.restaurantId, userId },
    prisma
  );

  if (restaurant.restaurantLanguage.length > 1 && autoTranslateEnabled) {
    additionalTranslations =
      await createFieldTranslationsForAdditionalLanguages<CategoryTranslationField>(
        {
          sourceLanguage: input.languageCode,
          restaurantLanguages: restaurant.restaurantLanguage,
          fieldsForTranslation: [["name", input.name]],
        }
      );
  }

  const mainTranslation =
    formatFieldsToTranslationTable<CategoryTranslationField>(
      ["name"],
      restInput
    );
  const translations = [...mainTranslation, ...additionalTranslations];

  await categoryRepository.updateCategory(
    { ...input, userId },
    translations,
    prisma
  );
};

export const updateCategoriesPosition = async ({
  ctx,
  input,
}: {
  ctx: ProtectedContext;
  input: UpdateCategoriesPositionInput;
}) => {
  const userId = ctx.session.user.id;
  await categoryRepository.updateManyCategoriesPositions(input, userId, prisma);
};

export const deleteCategory = async ({
  ctx,
  input,
}: {
  ctx: ProtectedContext;
  input: DeleteCategorytInput;
}) => {
  const userId = ctx.session.user.id;
  await categoryRepository.deleteCategory(
    { id: input.categoryId, userId },
    prisma
  );
};
