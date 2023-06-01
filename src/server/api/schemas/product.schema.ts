import { z } from "zod";

import { languageCodeS } from "./common.schema";

export const createProductSchema = z.object({
  menuId: z.string(),
  categoryId: z.string(),
  isEnabled: z.boolean().optional(),
  price: z.number(),
  //TODO: UPDATE IT
  measurmentUnit: z.string().optional(),
  measurmentValue: z.string().optional(),
  name: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  languageCode: languageCodeS,
});

export const updateProductSchema = z.object({
  productId: z.string(),
  price: z.number(),
  isEnabled: z.boolean(),
  measurmentUnit: z.string().optional(),
  measurmentValue: z.string().optional(),
  name: z.string(),
  description: z.string(),
  imageUrl: z.string().optional(),
  languageCode: languageCodeS,
});

export const deleteProductSchema = z.object({
  productId: z.string(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type DeleteProducttInput = z.infer<typeof deleteProductSchema>;
