import { z } from "zod";

import { languageCodeS, measurementUnitS } from "./common.schema";

export const createProductSchemaInput = z.object({
  restaurantId: z.string(),
  categoryId: z.string(),
  isEnabled: z.boolean().optional(),
  price: z.number(),
  measurementUnit: measurementUnitS.optional(),
  measurementValue: z.string().optional(),
  name: z.string().trim().min(2).max(50),
  description: z.string().trim().max(150).optional(),
  imageBase64: z.string().optional(),
  languageCode: languageCodeS,
});

export const updateProductSchemaInput = z.object({
  productId: z.string(),
  price: z.number(),
  isEnabled: z.boolean(),
  measurementUnit: measurementUnitS.optional(),
  measurementValue: z.string().optional(),
  name: z.string().trim().min(2).max(50),
  description: z.string().trim().max(150).optional(),
  imageBase64: z.string().optional(),
  isImageDeleted: z.boolean(),
  languageCode: languageCodeS,
});

export const updateProductsPositionSchemaInput = z.array(
  z.object({ id: z.string(), position: z.number() })
);

export const deleteProductSchemaInput = z.object({
  productId: z.string(),
});

export type CreateProductInput = z.infer<typeof createProductSchemaInput>;
export type UpdateProductInput = z.infer<typeof updateProductSchemaInput>;
export type UpdateProductsPositionInput = z.infer<
  typeof updateProductsPositionSchemaInput
>;
export type DeleteProductInput = z.infer<typeof deleteProductSchemaInput>;
