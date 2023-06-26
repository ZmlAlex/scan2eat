import { z } from "zod";

import { currencyCodeS, languageCodeS } from "./common.schema";

export const getRestaurantSchemaInput = z.object({
  restaurantId: z.string(),
});

// export const getAllRestaurantsSchemaInput = z.object({});

export const createRestaurantSchemaInput = z.object({
  name: z.string(),
  description: z.string().optional(),
  address: z.string().optional(),
  workingHours: z.string(),
  logoUrl: z.string(),
  currencyCode: currencyCodeS,
  languageCode: languageCodeS,
});

export const updateRestaurantSchemaInput = z.object({
  restaurantId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  address: z.string().optional(),
  workingHours: z.string(),
  logoUrl: z.string().optional(),
  currencyCode: currencyCodeS,
  languageCode: languageCodeS,
});

export const setPublishedRestaurantSchemaInput = z.object({
  restaurantId: z.string(),
  isPublished: z.boolean(),
});

export const deleteRestaurantSchemaInput = z.object({
  restaurantId: z.string(),
});

export type CreateRestaurantInput = z.infer<typeof createRestaurantSchemaInput>;
export type UpdateRestaurantInput = z.infer<typeof updateRestaurantSchemaInput>;
export type DeleteRestaurantInput = z.infer<typeof deleteRestaurantSchemaInput>;
