import { z } from "zod";

import { languageCodeS, measurementUnitS } from "./common.schema";

export const createProductSchemaInput = z.object({
  restaurantId: z.string(),
  categoryId: z.string(),
  isEnabled: z.boolean().optional(),
  price: z.number(),
  //TODO: UPDATE IT
  measurementUnit: measurementUnitS.optional(),
  measurementValue: z.string().optional(),
  name: z.string(),
  description: z.string(),
  imageBase64: z.string().optional(),
  languageCode: languageCodeS,
});

export const updateProductSchemaInput = z.object({
  productId: z.string(),
  price: z.number(),
  isEnabled: z.boolean(),
  measurementUnit: measurementUnitS.optional(),
  measurementValue: z.string().optional(),
  name: z.string(),
  description: z.string(),
  imageBase64: z.string().optional(),
  isImageDeleted: z.boolean(),
  languageCode: languageCodeS,
});

export const deleteProductSchemaInput = z.object({
  productId: z.string(),
});

export type CreateProductInput = z.infer<typeof createProductSchemaInput>;
export type UpdateProductInput = z.infer<typeof updateProductSchemaInput>;
export type DeleteProductInput = z.infer<typeof deleteProductSchemaInput>;
