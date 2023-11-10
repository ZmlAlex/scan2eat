import { z } from "zod";

import { languageCodeS } from "./common.schema";

export const createCategorySchemaInput = z.object({
  restaurantId: z.string(),
  name: z.string().min(1).max(30),
  languageCode: languageCodeS,
});

export const updateCategorySchemaInput = z.object({
  restaurantId: z.string(),
  categoryId: z.string(),
  name: z.string().min(1).max(30),
  languageCode: languageCodeS,
  autoTranslateEnabled: z.boolean(),
});

export const updateCategoriesPositionSchemaInput = z.array(
  z.object({ id: z.string(), position: z.number() })
);

export const deleteCategorySchemaInput = z.object({
  categoryId: z.string(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchemaInput>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchemaInput>;
export type UpdateCategoriesPositionInput = z.infer<
  typeof updateCategoriesPositionSchemaInput
>;
export type DeleteCategorytInput = z.infer<typeof deleteCategorySchemaInput>;
