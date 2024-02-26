import type {
  CategoryTranslationField,
  ProductTranslationField,
  RestaurantI18N,
  RestaurantTranslationField,
} from "@prisma/client";
import { TRPCError } from "@trpc/server";

import { MAX_RESTAURANTS_PER_ACCOUNT } from "~/config/limitations";
import { baseErrorMessage } from "~/helpers/errorMapper";
import { updateManyCategoriesTranslations } from "~/server/api/category/category.service";
import { updateManyProductsTranslations } from "~/server/api/product/product.service";
import type {
  CreateRestaurantInput,
  CreateRestaurantLanguageInput,
  DeleteRestaurantInput,
  GetRestaurantInput,
  SetEnabledRestaurantLanguagesInput,
  SetPublishedRestaurantInput,
  UpdateRestaurantInput,
} from "~/server/api/restaurant/restaurant.schema";
import {
  createRestaurant,
  createRestaurantLanguage,
  deleteRestaurant,
  findAllRestaurants,
  findRestaurantById,
  findRestaurantByIdAndUserId,
  updateRestaurant,
} from "~/server/api/restaurant/restaurant.service";
import type { Context, ProtectedContext } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { createFieldTranslationsForAdditionalLanguages } from "~/server/helpers/createFieldTranslationsForAddtionalLanugages";
import { createFieldTranslationsForNewLanguage } from "~/server/helpers/createFieldTranslationsForNewLanguage";
import { uploadImage } from "~/server/libs/cloudinary";

export const getRestaurantHandler = ({
  input,
}: {
  ctx: Context;
  input: GetRestaurantInput;
}) => {
  return findRestaurantById(input.restaurantId, prisma);
};

export const getRestaurantWithUserCheckHandler = ({
  ctx,
  input,
}: {
  ctx: ProtectedContext;
  input: GetRestaurantInput;
}) => {
  const userId = ctx.session.user.id;

  return findRestaurantByIdAndUserId(
    { restaurantId: input.restaurantId, userId },
    prisma
  );
};

export const getAllRestaurantsHandler = ({
  ctx,
}: {
  ctx: ProtectedContext;
}) => {
  return findAllRestaurants({ userId: ctx.session.user.id }, prisma);
};

export const createRestaurantHandler = async ({
  ctx,
  input,
}: {
  ctx: ProtectedContext;
  input: CreateRestaurantInput;
}) => {
  const userId = ctx.session.user.id;
  let uploadedImageUrl;

  const allRestaurants = await findAllRestaurants({ userId }, prisma);

  if (allRestaurants.length >= MAX_RESTAURANTS_PER_ACCOUNT) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: baseErrorMessage.ReachedRestaurantsLimit,
    });
  }

  if (input.logoImageBase64) {
    const uploadedImage = await uploadImage(input.logoImageBase64, userId);
    uploadedImageUrl = uploadedImage.url;
  }

  return createRestaurant(
    { ...input, userId, logoUrl: uploadedImageUrl },
    prisma
  );
};

export const updateRestaurantHandler = async ({
  ctx,
  input,
}: {
  ctx: ProtectedContext;
  input: UpdateRestaurantInput;
}) => {
  const userId = ctx.session.user.id;
  //if image deleted we want to remove it from db, if not keep - original in db
  let uploadedImageUrl = input.isImageDeleted ? "" : undefined;
  let additionalTranslations: Pick<
    RestaurantI18N,
    "fieldName" | "languageCode" | "translation"
  >[] = [];

  const restaurant = await findRestaurantByIdAndUserId(
    { restaurantId: input.restaurantId, userId },
    prisma
  );

  if (restaurant.restaurantLanguage.length > 1 && input.autoTranslateEnabled) {
    additionalTranslations =
      await createFieldTranslationsForAdditionalLanguages<RestaurantTranslationField>(
        {
          sourceLanguage: input.languageCode,
          restaurantLanguages: restaurant.restaurantLanguage,
          fieldsForTranslation: [
            ["name", input.name],
            ["description", input.description],
            ["address", input.address],
          ],
        }
      );
  }

  if (input.logoImageBase64) {
    const uploadedImage = await uploadImage(input.logoImageBase64, userId);
    uploadedImageUrl = uploadedImage.url;
  }

  await updateRestaurant(
    { ...input, logoUrl: uploadedImageUrl },
    additionalTranslations,
    { id: input.restaurantId },
    prisma
  );

  return findRestaurantByIdAndUserId(
    { restaurantId: input.restaurantId, userId },
    prisma
  );
};

export const setPublishedRestaurantHandler = async ({
  ctx,
  input,
}: {
  ctx: ProtectedContext;
  input: SetPublishedRestaurantInput;
}) => {
  const userId = ctx.session.user.id;

  await prisma.restaurant.update({
    where: { id: input.restaurantId },
    data: { isPublished: input.isPublished },
  });

  return findRestaurantByIdAndUserId(
    { restaurantId: input.restaurantId, userId },
    prisma
  );
};

export const deleteRestaurantHandler = async ({
  ctx,
  input,
}: {
  ctx: ProtectedContext;
  input: DeleteRestaurantInput;
}) => {
  await deleteRestaurant({ id: input.restaurantId }, prisma);

  return findAllRestaurants({ userId: ctx.session?.user.id }, prisma);
};

// Restaurant Language handlers

export const createRestaurantLanguageHandler = async ({
  ctx,
  input,
}: {
  ctx: ProtectedContext;
  input: CreateRestaurantLanguageInput;
}) => {
  const userId = ctx.session.user.id;

  const restaurant = await findRestaurantByIdAndUserId(
    { restaurantId: input.restaurantId, userId },
    prisma
  );

  //TODO: CHANGE WITH DEFAULT LANGUAGE
  const defaultRestaurantLanguage =
    restaurant.restaurantLanguage[0]?.languageCode ?? "english";

  const categoriesTextForTranslationPromises =
    createFieldTranslationsForNewLanguage<CategoryTranslationField>({
      defaultLanguage: defaultRestaurantLanguage,
      items: restaurant.category ?? [],
      itemKey: "categoryI18N",
      itemIdIdentificator: "categoryId",
      targetLanguage: input.languageCode,
    });

  const productsTextForTranslationPromises =
    createFieldTranslationsForNewLanguage<ProductTranslationField>({
      defaultLanguage: defaultRestaurantLanguage,
      items: restaurant.product ?? [],
      itemKey: "productI18N",
      itemIdIdentificator: "productId",
      targetLanguage: input.languageCode,
    });

  const restaurantTextForTranslationPromises =
    createFieldTranslationsForNewLanguage<RestaurantTranslationField>({
      defaultLanguage: defaultRestaurantLanguage,
      items: [restaurant],
      itemKey: "restaurantI18N",
      targetLanguage: input.languageCode,
    });

  const restaurantResult = await Promise.all(
    restaurantTextForTranslationPromises
  );

  const categoriesResult = await Promise.all(
    categoriesTextForTranslationPromises
  );

  const productsResult = await Promise.all(productsTextForTranslationPromises);

  await prisma.$transaction([
    createRestaurantLanguage({ ...input, userId }, restaurantResult, prisma),
    ...updateManyCategoriesTranslations(categoriesResult, prisma),
    ...updateManyProductsTranslations(productsResult, prisma),
  ]);

  return findRestaurantByIdAndUserId(
    { restaurantId: input.restaurantId, userId },
    prisma
  );
};

export const setEnabledRestaurantLanguagesHandler = async ({
  ctx,
  input,
}: {
  ctx: ProtectedContext;
  input: SetEnabledRestaurantLanguagesInput;
}) => {
  const userId = ctx.session.user.id;

  const restaurantLanguageTransactions = input.languageCodes.map((language) =>
    prisma.restaurantLanguage.updateMany({
      where: {
        restaurantId: input.restaurantId,
        languageCode: language.languageCode,
      },
      data: {
        isEnabled: language.isEnabled,
      },
    })
  );

  await prisma.$transaction(restaurantLanguageTransactions);

  return findRestaurantByIdAndUserId(
    { restaurantId: input.restaurantId, userId },
    prisma
  );
};
