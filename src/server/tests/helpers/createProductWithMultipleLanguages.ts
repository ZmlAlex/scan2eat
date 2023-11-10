import type { ProductTranslationField } from "@prisma/client";

import type { CreateProductInput } from "~/server/api/schemas/product.schema";
import { prisma } from "~/server/db";
import { formatFieldsToTranslationTable } from "~/server/helpers/formatFieldsToTranslationTable";
import { transformTranslation } from "~/server/helpers/formatTranslation";

//TODO: add default value
export const createProductWithMultipleLanguages = async (
  input: Omit<CreateProductInput, "imageBase64"> & {
    imageUrl: string;
    userId: string;
  }
) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { price, isEnabled, ...restInput } = input;

  const translations = formatFieldsToTranslationTable<ProductTranslationField>(
    ["name", "description"],
    restInput
  );

  const additionalTranslations =
    formatFieldsToTranslationTable<ProductTranslationField>(
      ["name", "description"],
      {
        languageCode: "russian",
        name: "текст на русском",
        description: "текст на русском",
      }
    );

  const result = await prisma.product.create({
    data: {
      userId: input.userId,
      restaurantId: input.restaurantId,
      categoryId: input.categoryId,
      imageUrl: input.imageUrl,
      measurementUnit: input.measurementUnit,
      measurementValue: input.measurementValue ?? "",
      price,
      productI18N: {
        createMany: {
          data: [...translations, ...additionalTranslations],
        },
      },
    },
    include: {
      productI18N: {
        select: {
          fieldName: true,
          translation: true,
          languageCode: true,
        },
      },
    },
  });

  return {
    ...result,
    productI18N: transformTranslation<ProductTranslationField>(
      result.productI18N
    ),
  };
};
