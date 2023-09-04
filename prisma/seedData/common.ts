import {
  type CurrencyCode,
  type LanguageCode,
  type LanguageTitle,
} from "@prisma/client";

export const languages: { title: LanguageTitle; code: LanguageCode }[] = [
  {
    title: "english",
    code: "english",
  },
  {
    title: "russian",
    code: "russian",
  },
];

export const currencies: { code: CurrencyCode; title: string }[] = [
  {
    code: "USD",
    title: "dollar",
  },
  {
    code: "RUB",
    title: "рубль",
  },
];
