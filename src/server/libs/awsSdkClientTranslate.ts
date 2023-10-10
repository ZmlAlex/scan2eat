import {
  TranslateClient,
  TranslateTextCommand,
  type TranslateTextRequest,
} from "@aws-sdk/client-translate";
import { type LanguageCode } from "@prisma/client";

//TODO: GET RID OF IT WHEN LANGUAGE WILL BE FIXED
const languageMap = {
  russian: "ru",
  english: "en",
};

const translateClient = new TranslateClient();

export const translate = async (
  params: TranslateTextRequest & {
    SourceLanguageCode: LanguageCode;
    TargetLanguageCode: LanguageCode;
  }
) => {
  const input = {
    ...params,
    SourceLanguageCode: languageMap[params.SourceLanguageCode],
    TargetLanguageCode: languageMap[params.TargetLanguageCode],
  };

  const command = new TranslateTextCommand(input);
  const response = await translateClient.send(command);

  return response;
};
