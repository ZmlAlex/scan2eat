import { z } from "zod";

export const currencyCodeS = z.enum(["USD", "RUB", "EUR", "GBP"]);
export const languageCodeS = z.enum(["russian", "english"]);
