import type { ProductI18N, ProductTranslationField } from "@prisma/client";

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
import type { Context } from "~/server/api/trpc";
import { createFieldTranslationsForAdditionalLanguages } from "~/server/helpers/createFieldTranslationsForAddtionalLanugages";
import { uploadImage } from "~/server/utils/cloudinary";

export const createProductHandler = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: CreateProductInput;
}) => {
  let uploadedImageUrl;

  let additionalTranslations: Pick<
    ProductI18N,
    "fieldName" | "languageCode" | "translation"
  >[] = [];

  const restaurant = await findRestaurantById(input.restaurantId, ctx.prisma);

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

  if (input.imageBase64 && ctx.session?.user.id) {
    const uploadedImage = await uploadImage(
      input.imageBase64,
      ctx.session.user.id
    );
    uploadedImageUrl = uploadedImage.url;
  }

  const createdProduct = await createProduct(
    { ...input, imageUrl: uploadedImageUrl },
    additionalTranslations,
    ctx.prisma
  );

  return findRestaurantById(createdProduct.restaurantId, ctx.prisma);
};

export const updateProductHandler = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: UpdateProductInput;
}) => {
  //if image deleted we want to remove it from db, if not keep - original in db
  let uploadedImageUrl = input.isImageDeleted ? "" : undefined;

  if (input.imageBase64 && ctx.session?.user.id) {
    const uploadedImage = await uploadImage(
      input.imageBase64,
      ctx.session.user.id
    );
    uploadedImageUrl = uploadedImage.url;
  }

  const updatedProduct = await updateProduct(
    { ...input, imageUrl: uploadedImageUrl },
    ctx.prisma
  );

  return findRestaurantById(updatedProduct.restaurantId, ctx.prisma);
};

export const updateProductsPositionHandler = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: UpdateProductsPositionInput;
}) => {
  // TODO: MOVE TO THE SERVICE?
  const [updatedProduct] = await ctx.prisma.$transaction(
    input.map((item) =>
      ctx.prisma.product.update({
        data: { position: item.position },
        where: { id: item.id },
      })
    )
  );

  return findRestaurantById(updatedProduct?.restaurantId ?? "", ctx.prisma);
};

export const deleteProductHandler = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: DeleteProductInput;
}) => {
  const deletedProduct = await ctx.prisma.product.delete({
    where: {
      id: input.productId,
    },
  });
  return findRestaurantById(deletedProduct.restaurantId, ctx.prisma);
};
