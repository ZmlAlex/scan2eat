import { z } from "zod";

export const createProductSchema = z.object({
  menuId: z.string(),
  categoryId: z.string(),
  isEnabled: z.boolean(),
  price: z.number(),
  //TODO: UPDATE IT
  measurmentUnit: z.string(),
  measurmentValue: z.string(),
  name: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  languageCode: z.enum(["russian", "english"]),
});

export const updateProductSchema = z.object({
  productId: z.string(),
  price: z.number(),
  //TODO: UPDATE IT
  isEnabled: z.boolean(),
  measurmentUnit: z.string(),
  measurmentValue: z.string(),
  name: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  languageCode: z.enum(["russian", "english"]),
});

export const deleteProductSchema = z.object({ productId: z.string() });

//TODO:create types for services
