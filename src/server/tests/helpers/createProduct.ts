import type { ProductTranslationField } from "@prisma/client";

import type { CreateProductInput } from "~/server/api/schemas/product.schema";
import { prisma } from "~/server/db";
import { formatFieldsToTranslationTable } from "~/server/helpers/formatFieldsToTranslationTable";
import { transformTranslation } from "~/server/helpers/formatTranslation";

//TODO: add default value
export const createProduct = async (input: CreateProductInput) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { price, isEnabled, ...restInput } = input;

  const translations = formatFieldsToTranslationTable<ProductTranslationField>(
    ["name", "description"],
    restInput
  );

  const result = await prisma.product.create({
    data: {
      menuId: input.menuId,
      categoryId: input.categoryId,
      imageUrl: input.imageUrl,
      measurementUnit: input.measurmentUnit ?? "",
      measurementValue: input.measurmentValue ?? "",
      price,
      productI18N: {
        createMany: {
          data: translations,
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