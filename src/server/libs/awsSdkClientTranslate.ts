import {
  TranslateClient,
  TranslateTextCommand,
  type TranslateTextRequest,
} from "@aws-sdk/client-translate";
import { type LanguageCode } from "@prisma/client";
import { log } from "next-axiom";

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

  log.info("Translate Content START", { input });

  const command = new TranslateTextCommand(input);
  const response = await translateClient.send(command);

  log.info("Translate Content FINISH", { input });

  return response;
};
