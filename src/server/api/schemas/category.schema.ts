import { z } from "zod";
import { languageCodeS } from "./common.schema";

export const getRestaurantSchema = z.object({ restaurantId: z.string() });

export const createCategorySchema = z.object({
  menuId: z.string(),
  name: z.string(),
  languageCode: languageCodeS,
});

export const updateCategorySchema = z.object({
  categoryId: z.string(),
  name: z.string(),
  languageCode: languageCodeS,
});

export const deleteCategorySchema = z.object({ categoryId: z.string() });

//TODO:create types for services
