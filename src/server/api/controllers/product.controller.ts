import type { ProductI18N, ProductTranslationField } from "@prisma/client";
import { TRPCError } from "@trpc/server";

import { MAX_PRODUCTS_PER_CATEGORY } from "~/config/limitations";
import type {
  CreateProductInput,
  DeleteProductInput,
  UpdateProductInput,
  UpdateProductsPositionInput,
} from "~/server/api/schemas/product.schema";
import {
  createProduct,
  updateProduct,
} from "~/server/api/services/product.service";
import { findRestaurantById } from "~/server/api/services/restaurant.service";
import type { ProtectedContext } from "~/server/api/trpc";
import { createFieldTranslationsForAdditionalLanguages } from "~/server/helpers/createFieldTranslationsForAddtionalLanugages";
import { uploadImage } from "~/server/libs/cloudinary";
import { baseErrorMessage } from "~/utils/errorMapper";

export const createProductHandler = async ({
  ctx,
  input,
}: {
  ctx: ProtectedContext;
  input: CreateProductInput;
}) => {
  const userId = ctx.session.user.id;
  let uploadedImageUrl;

  let additionalTranslations: Pick<
    ProductI18N,
    "fieldName" | "languageCode" | "translation"
  >[] = [];
  console.log("debug!!!");
  const restaurant = await findRestaurantById(input.restaurantId, ctx.prisma);

  if (
    restaurant.product.filter(
      (product) => product.categoryId === input.categoryId
    ).length >= MAX_PRODUCTS_PER_CATEGORY
  ) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: baseErrorMessage.ReachedProductsLimit,
    });
  }

  if (restaurant.restaurantLanguage.length > 1) {
    additionalTranslations =
      await createFieldTranslationsForAdditionalLanguages<ProductTranslationField>(
        {
          sourceLanguage: input.languageCode,
          fieldsForTranslation: [
            ["name", input.name],
            ["description", input.description],
          ],
          restaurantLanguages: restaurant.restaurantLanguage,
        }
      );
  }

  if (input.imageBase64) {
    const uploadedImage = await uploadImage(input.imageBase64, userId);
    uploadedImageUrl = uploadedImage.url;
  }

  const createdProduct = await createProduct(
    { ...input, userId, imageUrl: uploadedImageUrl },
    additionalTranslations,
    ctx.prisma
  );

  return findRestaurantById(createdProduct.restaurantId, ctx.prisma);
};

export const updateProductHandler = async ({
  ctx,
  input,
}: {
  ctx: ProtectedContext;
  input: UpdateProductInput;
}) => {
  const { prisma } = ctx;
  const userId = ctx.session.user.id;
  //if image deleted we want to remove it from db, if not keep - original in db
  let uploadedImageUrl = input.isImageDeleted ? "" : undefined;

  if (input.imageBase64) {
    const uploadedImage = await uploadImage(input.imageBase64, userId);
    uploadedImageUrl = uploadedImage.url;
  }

  const updatedProduct = await updateProduct(
    { ...input, userId, imageUrl: uploadedImageUrl },
    ctx.prisma
  );

  return findRestaurantById(updatedProduct.restaurantId, prisma);
};

export const updateProductsPositionHandler = async ({
  ctx,
  input,
}: {
  ctx: ProtectedContext;
  input: UpdateProductsPositionInput;
}) => {
  const userId = ctx.session.user.id;
  // TODO: MOVE TO THE SERVICE?
  const [updatedProduct] = await ctx.prisma.$transaction(
    input.map((item) =>
      ctx.prisma.product.update({
        data: { position: item.position },
        where: { id: item.id, userId },
      })
    )
  );

  return findRestaurantById(updatedProduct?.restaurantId ?? "", ctx.prisma);
};

export const deleteProductHandler = async ({
  ctx,
  input,
}: {
  ctx: ProtectedContext;
  input: DeleteProductInput;
}) => {
  const userId = ctx.session.user.id;

  const deletedProduct = await ctx.prisma.product.delete({
    where: {
      id: input.productId,
      userId,
    },
  });
  return findRestaurantById(deletedProduct.restaurantId, ctx.prisma);
};
