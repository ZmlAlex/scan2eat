import { z } from "zod";

import { languageCodeS, measurementUnitS } from "../../helpers/common.schema";

export const createProductInput = z.object({
  restaurantId: z.string(),
  categoryId: z.string(),
  isEnabled: z.boolean().optional(),
  price: z.number(),
  measurementUnit: measurementUnitS.optional(),
  measurementValue: z.string().optional(),
  name: z.string().trim().min(2).max(50),
  description: z.string().trim().max(150),
  imageBase64: z.string().optional(),
  languageCode: languageCodeS,
});

export const updateProductInput = z.object({
  restaurantId: z.string(),
  productId: z.string(),
  price: z.number(),
  isEnabled: z.boolean(),
  measurementUnit: measurementUnitS.optional(),
  measurementValue: z.string().optional(),
  name: z.string().trim().min(2).max(50),
  description: z.string().trim().max(150),
  imageBase64: z.string().optional(),
  isImageDeleted: z.boolean(),
  autoTranslateEnabled: z.boolean(),
  languageCode: languageCodeS,
});

export const updateProductsPositionInput = z.array(
  z.object({
    restaurantId: z.string(),
    id: z.string(),
    position: z.number(),
  })
);

export const deleteProductInput = z.object({
  restaurantId: z.string(),
  productId: z.string(),
});

export type CreateProductInput = z.infer<typeof createProductInput>;
export type UpdateProductInput = z.infer<typeof updateProductInput>;
export type UpdateProductsPositionInput = z.infer<
  typeof updateProductsPositionInput
>;
export type DeleteProductInput = z.infer<typeof deleteProductInput>;
