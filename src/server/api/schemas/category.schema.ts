import { z } from "zod";

export const getRestaurantSchema = z.object({ restaurantId: z.string() });

export const createCategorySchema = z.object({
  menuId: z.string(),
  name: z.string(),
  //TODO: think about reference
  languageCode: z.enum(["russian", "english"]),
});

export const updateCategorySchema = z.object({
  categoryId: z.string(),
  name: z.string(),
  //TODO: think about reference
  languageCode: z.enum(["russian", "english"]),
});

export const deleteCategorySchema = z.object({ categoryId: z.string() });

//TODO:create types for services
