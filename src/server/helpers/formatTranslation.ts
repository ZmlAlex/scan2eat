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
