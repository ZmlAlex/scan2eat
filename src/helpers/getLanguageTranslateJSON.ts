import englishLanguageJSON from "~/lang/english.json";
import russianLanguageJSON from "~/lang/russian.json";

const languageMap = {
  russian: russianLanguageJSON,
  english: englishLanguageJSON,
} as const;

/**  Use it when you want don't have access to the useTranslation hook . */
export const getLanguageTranslationJSON = (pathname: string) => {
  const additionalLanguages = ["russian"];
  const defaultlLanguage = "english";

  const language = (additionalLanguages.find((lang) =>
    pathname.includes(lang)
  ) || defaultlLanguage) as keyof typeof languageMap;

  return languageMap[language];
};
