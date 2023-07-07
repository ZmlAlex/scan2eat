import AWS from "aws-sdk";

//TODO: GET RID OF IT WHEN LANGUAGE WILL BE FIXED
const languageMap = {
  russian: "ru",
  english: "en",
};

const translateInstance = new AWS.Translate();

export const translate = (params: AWS.Translate.TranslateTextRequest) => {
  return translateInstance
    .translateText({
      ...params,
      SourceLanguageCode:
        languageMap[params.SourceLanguageCode as keyof typeof languageMap],
      TargetLanguageCode:
        languageMap[params.TargetLanguageCode as keyof typeof languageMap],
    })
    .promise();
};
