import type { LanguageCode } from "@prisma/client";

//TODO: COVER BY UNIT TESTS
export const transformTranslation = <T extends string>(
  translation: {
    fieldName: T;
    translation: string;
    languageCode: LanguageCode;
  }[]
) => {
  return translation.reduce((acc, cur) => {
    acc[cur.fieldName] = cur.translation;
    return acc;
  }, {} as Record<T, string>);
};

//TODO: COVER BY UNIT TESTS
export const transformMultipleTranslations = <T extends string>(
  translation: {
    fieldName: T;
    translation: string;
    languageCode: LanguageCode;
  }[]
) => {
  return translation.reduce((acc, cur) => {
    if (!acc[cur.languageCode]) {
      acc[cur.languageCode] = {} as Record<T, string>;
    }

    acc[cur.languageCode][cur.fieldName] = cur.translation;

    return acc;
    //TODO: MOVE TYPES GLOBALY AND SHARE IT WITH TESTS
  }, {} as Record<LanguageCode, Record<T, string>>);
};
