import { z } from "zod";
import { languageCodeS } from "./common.schema";

export const createCategorySchema = z.object({
  menuId: z.string(),
  name: z.string(),
  languageCode: languageCodeS,
});

export const updateCategorySchema = z.object({
  // restaurantId: z.string().optional(),
  categoryId: z.string(),
  name: z.string(),
  languageCode: languageCodeS,
});

export const deleteCategorySchema = z.object({ categoryId: z.string() });

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type DeleteCategorytInput = z.infer<typeof deleteCategorySchema>;
