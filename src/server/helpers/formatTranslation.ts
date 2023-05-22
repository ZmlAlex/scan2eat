//TODO: COVER BY UNIT TESTS
export const transformTranslation = <T extends string>(
  translation: { fieldName: string; translation: string }[]
) => {
  return translation.reduce((acc, cur) => {
    acc[cur.fieldName as keyof typeof acc] = cur.translation;
    return acc;
  }, {} as Record<T, string>);
};
