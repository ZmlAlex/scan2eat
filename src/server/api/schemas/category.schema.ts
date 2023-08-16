import { z } from "zod";

import { languageCodeS } from "./common.schema";

export const createCategorySchemaInput = z.object({
  restaurantId: z.string(),
  name: z.string(),
  languageCode: languageCodeS,
});

export const updateCategorySchemaInput = z.object({
  restaurantId: z.string(),
  categoryId: z.string(),
  name: z.string(),
  languageCode: languageCodeS,
});

export const deleteCategorySchemaInput = z.object({
  categoryId: z.string(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchemaInput>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchemaInput>;
export type DeleteCategorytInput = z.infer<typeof deleteCategorySchemaInput>;
