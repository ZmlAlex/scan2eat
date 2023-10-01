import { z } from "zod";

import { currencyCodeS, languageCodeS } from "./common.schema";

export const getRestaurantSchemaInput = z.object({
  restaurantId: z.string(),
});

// export const getAllRestaurantsSchemaInput = z.object({});

export const createRestaurantSchemaInput = z.object({
  name: z.string().min(2).max(30),
  description: z.string().max(150).optional(),
  address: z.string().max(50).optional(),
  workingHours: z.string(),
  logoImageBase64: z.string().optional(),
  currencyCode: currencyCodeS,
  languageCode: languageCodeS,
});

export const createRestaurantLanguageSchemaInput = z.object({
  restaurantId: z.string(),
  languageCode: languageCodeS,
});

export const updateRestaurantSchemaInput = z.object({
  restaurantId: z.string(),
  name: z.string().min(2).max(30),
  description: z.string().min(2).max(150).optional(),
  address: z.string().max(50).optional(),
  workingHours: z.string(),
  logoImageBase64: z.string().optional(),
  isImageDeleted: z.boolean(),
  currencyCode: currencyCodeS,
  languageCode: languageCodeS,
});

export const setPublishedRestaurantSchemaInput = z.object({
  restaurantId: z.string(),
  isPublished: z.boolean(),
});

export const setEnabledRestaurantLanguagesSchemaInput = z.object({
  restaurantId: z.string(),
  languageCodes: z.array(
    z.object({ languageCode: languageCodeS, isEnabled: z.boolean() })
  ),
});

export const deleteRestaurantSchemaInput = z.object({
  restaurantId: z.string(),
});

export type GetRestaurantInput = z.infer<typeof getRestaurantSchemaInput>;
export type CreateRestaurantInput = z.infer<typeof createRestaurantSchemaInput>;
export type CreateRestaurantLanguageInput = z.infer<
  typeof createRestaurantLanguageSchemaInput
>;
export type UpdateRestaurantInput = z.infer<typeof updateRestaurantSchemaInput>;
export type DeleteRestaurantInput = z.infer<typeof deleteRestaurantSchemaInput>;
export type SetPublishedRestaurantInput = z.infer<
  typeof setPublishedRestaurantSchemaInput
>;
export type SetEnabledRestaurantLanguagesInput = z.infer<
  typeof setEnabledRestaurantLanguagesSchemaInput
>;
