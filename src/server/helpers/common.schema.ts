import { z } from "zod";

// TODO: TAKE FROM PRISMA
export const currencyCodeS = z.enum(["USD", "RUB", "EUR", "GBP"]);
export const languageCodeS = z.enum(["russian", "english"]);
export const measurementUnitS = z.enum(["g", "ml", "pcs"]);
