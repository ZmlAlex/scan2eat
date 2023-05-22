import { type LanguageCode } from "@prisma/client";

//TODO: COVER BY UNIT TESTS
export const formatFieldsToTranslationTable = <T extends string>(
  translationFields: T[],
  input: Record<string, string> & { languageCode: LanguageCode }
) =>
  translationFields.map((field) => ({
    fieldName: field,
    translation: input[field] || "",
    languageCode: input.languageCode,
  }));
