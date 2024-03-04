import type {
  CategoryTranslationField,
  ProductTranslationField,
  RestaurantI18N,
  RestaurantTranslationField,
} from "@prisma/client";
import { TRPCError } from "@trpc/server";

import { MAX_RESTAURANTS_PER_ACCOUNT } from "~/config/limitations";
import { baseErrorMessage } from "~/helpers/errorMapper";
import * as categoryRepository from "~/server/api/category/category.repository";
import * as productRepository from "~/server/api/product/product.repository";
import * as restaurantRepository from "~/server/api/restaurant/restaurant.repository";
import type {
  CreateRestaurantInput,
  CreateRestaurantLanguageInput,
  DeleteRestaurantInput,
  GetRestaurantInput,
  SetEnabledRestaurantLanguagesInput,
  SetPublishedRestaurantInput,
  UpdateRestaurantInput,
} from "~/server/api/restaurant/restaurant.schema";
import type { ProtectedContext } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { createFieldTranslationsForAdditionalLanguages } from "~/server/helpers/createFieldTranslationsForAddtionalLanugages";
import { createFieldTranslationsForNewLanguage } from "~/server/helpers/createFieldTranslationsForNewLanguage";
import { formatFieldsToTranslationTable } from "~/server/helpers/formatFieldsToTranslationTable";
import { uploadImage } from "~/server/libs/cloudinary";

export const getRestaurant = ({ input }: { input: GetRestaurantInput }) => {
  return restaurantRepository.findRestaurantById(input.restaurantId, prisma);
};

export const getRestaurantWithUserCheck = ({
  ctx,
  input,
}: {
  ctx: ProtectedContext;
  input: GetRestaurantInput;
}) => {
  const userId = ctx.session.user.id;

  return restaurantRepository.findRestaurantByIdAndUserId(
    { restaurantId: input.restaurantId, userId },
    prisma
  );
};

export const getAllRestaurants = ({ ctx }: { ctx: ProtectedContext }) => {
  return restaurantRepository.findAllRestaurants(
    { userId: ctx.session.user.id },
    prisma
  );
};

export const createRestaurant = async ({
  ctx,
  input,
}: {
  ctx: ProtectedContext;
  input: CreateRestaurantInput;
}) => {
  const userId = ctx.session.user.id;
  let uploadedImageUrl;

  const allRestaurants = await restaurantRepository.findAllRestaurants(
    { userId },
    prisma
  );

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

  const mainTranslations =
    formatFieldsToTranslationTable<RestaurantTranslationField>(
      ["name", "description", "address"],
      input
    );

  return restaurantRepository.createRestaurant(
    { ...input, userId, logoUrl: uploadedImageUrl },
    mainTranslations,
    prisma
  );
};

export const updateRestaurant = async ({
  ctx,
  input,
}: {
  ctx: ProtectedContext;
  input: UpdateRestaurantInput;
}) => {
  const { isImageDeleted, autoTranslateEnabled, ...restInput } = input;
  const userId = ctx.session.user.id;
  //if image is deleted we want to remove it from db, if not keep - original in db
  let uploadedImageUrl = isImageDeleted ? "" : undefined;
  let additionalTranslations: Pick<
    RestaurantI18N,
    "fieldName" | "languageCode" | "translation"
  >[] = [];

  const restaurant = await restaurantRepository.findRestaurantByIdAndUserId(
    { restaurantId: input.restaurantId, userId },
    prisma
  );

  if (restaurant.restaurantLanguage.length > 1 && autoTranslateEnabled) {
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

  const mainTranslations =
    formatFieldsToTranslationTable<RestaurantTranslationField>(
      ["name", "description", "address"],
      restInput
    );
  const translations = [...mainTranslations, ...additionalTranslations];

  if (input.logoImageBase64) {
    const uploadedImage = await uploadImage(input.logoImageBase64, userId);
    uploadedImageUrl = uploadedImage.url;
  }

  await restaurantRepository.updateRestaurant(
    { ...input, logoUrl: uploadedImageUrl },
    translations,
    { id: input.restaurantId },
    prisma
  );
};

export const setPublishedRestaurant = async ({
  input,
}: {
  input: SetPublishedRestaurantInput;
}) => {
  await prisma.restaurant.update({
    where: { id: input.restaurantId },
    data: { isPublished: input.isPublished },
  });

  await restaurantRepository.setPublishedRestaurant(input, prisma);
};

export const deleteRestaurant = async ({
  input,
}: {
  input: DeleteRestaurantInput;
}) => {
  await restaurantRepository.deleteRestaurant(
    { id: input.restaurantId },
    prisma
  );
};

// Restaurant Language Services
export const createRestaurantLanguage = async ({
  ctx,
  input,
}: {
  ctx: ProtectedContext;
  input: CreateRestaurantLanguageInput;
}) => {
  const userId = ctx.session.user.id;

  const restaurant = await restaurantRepository.findRestaurantByIdAndUserId(
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
    restaurantRepository.createRestaurantLanguage(
      { ...input, userId },
      restaurantResult,
      prisma
    ),
    ...categoryRepository.updateManyCategoriesTranslations(
      categoriesResult,
      prisma
    ),
    ...productRepository.updateManyProductsTranslations(productsResult, prisma),
  ]);
};

export const setEnabledRestaurantLanguages = async ({
  input,
}: {
  input: SetEnabledRestaurantLanguagesInput;
}) => {
  await restaurantRepository.setEnabledManyRestaurantLanguages(input, prisma);
};
