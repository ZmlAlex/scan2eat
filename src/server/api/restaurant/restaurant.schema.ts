import { z } from "zod";

import { currencyCodeS, languageCodeS } from "~/server/helpers/common.schema";

export const getRestaurantInput = z.object({
  restaurantId: z.string(),
});

// export const getAllRestaurantsInput = z.object({});

export const createRestaurantInput = z.object({
  name: z.string().min(2).max(30),
  description: z.string().max(150).optional(),
  address: z.string().max(50).optional(),
  workingHours: z.string(),
  logoImageBase64: z.string().optional(),
  phone: z.string().optional(),
  currencyCode: currencyCodeS,
  languageCode: languageCodeS,
});

export const createRestaurantLanguageInput = z.object({
  restaurantId: z.string(),
  languageCode: languageCodeS,
});

export const updateRestaurantInput = z.object({
  restaurantId: z.string(),
  name: z.string().min(2).max(30),
  description: z.string().max(150).optional(),
  address: z.string().max(50).optional(),
  workingHours: z.string(),
  logoImageBase64: z.string().optional(),
  phone: z.string().optional(),
  isImageDeleted: z.boolean(),
  autoTranslateEnabled: z.boolean(),
  currencyCode: currencyCodeS,
  languageCode: languageCodeS,
});

export const setPublishedRestaurantInput = z.object({
  restaurantId: z.string(),
  isPublished: z.boolean(),
});

export const setEnabledRestaurantLanguagesInput = z.object({
  restaurantId: z.string(),
  languageCodes: z.array(
    z.object({ languageCode: languageCodeS, isEnabled: z.boolean() })
  ),
});

export const deleteRestaurantInput = z.object({
  restaurantId: z.string(),
});

export type GetRestaurantInput = z.infer<typeof getRestaurantInput>;
export type CreateRestaurantInput = z.infer<typeof createRestaurantInput>;
export type CreateRestaurantLanguageInput = z.infer<
  typeof createRestaurantLanguageInput
>;
export type UpdateRestaurantInput = z.infer<typeof updateRestaurantInput>;
export type DeleteRestaurantInput = z.infer<typeof deleteRestaurantInput>;
export type SetPublishedRestaurantInput = z.infer<
  typeof setPublishedRestaurantInput
>;
export type SetEnabledRestaurantLanguagesInput = z.infer<
  typeof setEnabledRestaurantLanguagesInput
>;
