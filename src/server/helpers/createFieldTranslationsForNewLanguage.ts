import { type LanguageCode } from "@prisma/client";

import { translate } from "~/server/libs/awsSdkClientTranslate";

type I18N = Record<string, Record<string, string>>;

type Params = {
  defaultLanguage: LanguageCode;
  targetLanguage: LanguageCode;
  items:
    | {
        id: string;
        categoryI18N?: I18N;
        productI18N?: I18N;
        restaurantI18N?: I18N;
      }[];
  itemKey: "categoryI18N" | "productI18N" | "restaurantI18N";
  itemIdIdentificator?: "categoryId" | "productId";
};

/**  Use it when youw want to create new restaurant language and you need to translate existing categories / products / restaurant details. */
export const createFieldTranslationsForNewLanguage = <T>({
  defaultLanguage,
  targetLanguage,
  items,
  itemKey,
  itemIdIdentificator,
}: Params) => {
  const itemsTextForTranslation = items.reduce((acc, cur) => {
    const itemFields = cur[itemKey]?.[defaultLanguage] || {};
    const fields = Object.entries(itemFields);

    const textForTranslation = fields.map((field) => ({
      id: cur.id,
      field,
    }));

    return [...acc, ...textForTranslation];
  }, [] as { id: string; field: [string, string] }[]);

  const itemsTextForTranslationPromises = itemsTextForTranslation
    .filter(({ field }) => field[1])
    .map(async (item) => {
      const [fieldName, fieldValue] = item.field;

      const { TranslatedText: translatedText } = await translate({
        Text: fieldValue,
        TargetLanguageCode: targetLanguage,
        SourceLanguageCode: defaultLanguage,
      });

      return {
        ...(itemIdIdentificator && { [itemIdIdentificator]: item.id }),
        fieldName: fieldName as T,
        translation: translatedText ?? "",
        languageCode: targetLanguage,
      };
    });

  return itemsTextForTranslationPromises;
};
