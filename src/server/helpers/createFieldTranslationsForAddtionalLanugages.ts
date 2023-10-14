import type { LanguageCode, RestaurantLanguage } from "@prisma/client";

import { translate } from "~/server/libs/awsSdkClientTranslate";

/**  Use it when you want to create new product or category for restaurant with all restaurant's languages. */
const createFieldTranslationsForAdditionalLanguages = async <T>({
  sourceLanguage,
  fieldsForTranslation,
  restaurantLanguages,
}: {
  sourceLanguage: LanguageCode;
  fieldsForTranslation: [T, string][];
  restaurantLanguages: Pick<RestaurantLanguage, "languageCode" | "isEnabled">[];
}) => {
  const textForTranslation: {
    fieldName: T;
    fieldValue: string;
    sourceLanguage: LanguageCode;
    targetLanguage: LanguageCode;
  }[] = [];
  // filter languages for translate
  const languagesForTranslations = restaurantLanguages.filter(
    (language) => language.languageCode !== sourceLanguage
  );

  // modify object to make it possible to translate
  const fieldsForTranslationWithLanguage = fieldsForTranslation
    .filter(([_, value]) => value)
    .map(([name, value]) => ({
      fieldName: name,
      fieldValue: value,
      sourceLanguage: sourceLanguage,
    }));

  // push same field name for each language
  languagesForTranslations.forEach((language) =>
    fieldsForTranslationWithLanguage.forEach((field) =>
      textForTranslation.push({
        ...field,
        targetLanguage: language.languageCode,
      })
    )
  );

  // translate each field
  const textForTranslationPromises = textForTranslation.map(async (product) => {
    const { TranslatedText: translatedText } = await translate({
      Text: product.fieldValue,
      TargetLanguageCode: product.targetLanguage,
      SourceLanguageCode: product.sourceLanguage,
    });

    return {
      fieldName: product.fieldName,
      translation: translatedText ?? "",
      languageCode: product.targetLanguage,
    };
  });

  return await Promise.all(textForTranslationPromises);
};

export { createFieldTranslationsForAdditionalLanguages };
