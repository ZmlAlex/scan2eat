import { z } from "zod";

export const getRestaurantSchema = z.object({ restaurantId: z.string() });

export const createRestaurantSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  address: z.string().optional(),
  workingHours: z.string(),
  logoUrl: z.string(),
  //TODO: think about unification
  currencyCode: z.enum(["USD", "RUB", "EUR", "GBP"]),
  //TODO: think about reference
  languageCode: z.enum(["russian", "english"]),
});

export const updateRestaurantSchema = z.object({
  restaurantId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  address: z.string().optional(),
  workingHours: z.string(),
  logoUrl: z.string(),
  //TODO: think about unification
  currencyCode: z.enum(["USD", "RUB", "EUR", "GBP"]),
  //TODO: think about reference
  languageCode: z.enum(["russian", "english"]),
});

export const deleteRestaurantSchema = z.object({ restaurantId: z.string() });

//TODO:create types for services
