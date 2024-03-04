import { z } from "zod";

import { languageCodeS } from "~/server/helpers/common.schema";

export const createCategoryInput = z.object({
  restaurantId: z.string(),
  name: z.string().min(1).max(30),
  languageCode: languageCodeS,
});

export const updateCategoryInput = z.object({
  restaurantId: z.string(),
  categoryId: z.string(),
  name: z.string().min(1).max(30),
  languageCode: languageCodeS,
  autoTranslateEnabled: z.boolean(),
});

export const updateCategoriesPositionInput = z.array(
  z.object({ restaurantId: z.string(), id: z.string(), position: z.number() })
);

export const deleteCategoryInput = z.object({
  restaurantId: z.string(),
  categoryId: z.string(),
});

export type CreateCategoryInput = z.infer<typeof createCategoryInput>;
export type UpdateCategoryInput = z.infer<typeof updateCategoryInput>;
export type UpdateCategoriesPositionInput = z.infer<
  typeof updateCategoriesPositionInput
>;
export type DeleteCategorytInput = z.infer<typeof deleteCategoryInput>;
