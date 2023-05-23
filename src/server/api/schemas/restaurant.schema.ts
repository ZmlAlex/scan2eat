import { z } from "zod";
import { currencyCodeS, languageCodeS } from "./common.schema";

export const getRestaurantSchema = z.object({ restaurantId: z.string() });

export const createRestaurantSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  address: z.string().optional(),
  workingHours: z.string(),
  logoUrl: z.string(),
  currencyCode: currencyCodeS,
  languageCode: languageCodeS,
});

export const updateRestaurantSchema = z.object({
  restaurantId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  address: z.string().optional(),
  workingHours: z.string(),
  logoUrl: z.string(),
  currencyCode: currencyCodeS,
  languageCode: languageCodeS,
});

export const deleteRestaurantSchema = z.object({ restaurantId: z.string() });

export type CreateRestaurantInput = z.infer<typeof createRestaurantSchema>;
export type UpdateRestaurantInput = z.infer<typeof updateRestaurantSchema>;
export type DeleteRestaurantInput = z.infer<typeof deleteRestaurantSchema>;
