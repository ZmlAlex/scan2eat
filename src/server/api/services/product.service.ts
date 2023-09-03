import type {
  LanguageCode,
  Prisma,
  PrismaClient,
  PrismaPromise,
  Product,
  ProductI18N,
  ProductTranslationField,
} from "@prisma/client";

import { formatFieldsToTranslationTable } from "~/server/helpers/formatFieldsToTranslationTable";

import type {
  CreateProductInput,
  UpdateProductInput,
} from "../schemas/product.schema";
import { type PrismaTransactionClient } from "./types";

export const createProduct = async (
  input: CreateProductInput & { imageUrl?: string },
  additionalTranslations: Pick<
    ProductI18N,
    "fieldName" | "languageCode" | "translation"
  >[],
  prisma: PrismaClient
) => {
  const { price, isEnabled, ...restInput } = input;

  const translations = formatFieldsToTranslationTable<ProductTranslationField>(
    ["name", "description"],
    restInput
  );

  const { position: biggestPosition } =
    (await prisma.product.findFirst({
      where: { categoryId: input.categoryId },
      select: { position: true },
      orderBy: { position: "desc" },
    })) ?? {};

  const nextPosition = biggestPosition ? biggestPosition + 1 : 0;

  return prisma.product.create({
    data: {
      isEnabled,
      price: price * 100,
      imageUrl: input.imageUrl ?? "",
      restaurantId: input.restaurantId,
      categoryId: input.categoryId,
      measurementUnit: input.measurementUnit,
      measurementValue: input.measurementValue,
      position: nextPosition,
      productI18N: {
        createMany: { data: [...translations, ...additionalTranslations] },
      },
    },
  });
};

export const updateProduct = async (
  input: Omit<UpdateProductInput, "isImageDeleted"> & { imageUrl?: string },
  prisma: PrismaClient
) => {
  const { price, isEnabled, imageUrl, ...restInput } = input;

  const updatedData: Partial<Product> = {
    price: price * 100,
    isEnabled,
    ...(input.measurementUnit && { measurementUnit: input.measurementUnit }),
    ...(input.measurementValue && { measurementValue: input.measurementValue }),
    ...(typeof imageUrl === "string" && { imageUrl }),
  };

  const translations = formatFieldsToTranslationTable<ProductTranslationField>(
    ["name", "description"],
    restInput
  );

  const transactions: PrismaPromise<unknown>[] = translations
    .filter(({ translation }) => translation)
    .map((record) =>
      prisma.productI18N.upsert({
        where: {
          productId_languageCode_fieldName: {
            languageCode: record.languageCode,
            fieldName: record.fieldName,
            productId: input.productId,
          },
        },
        update: {
          translation: record.translation,
        },
        create: {
          languageCode: record.languageCode,
          fieldName: record.fieldName,
          productId: input.productId,
          translation: record.translation,
        },
      })
    );

  const [updatedProduct] = await prisma.$transaction([
    prisma.product.update({
      where: { id: input.productId },
      data: updatedData,
    }),
    ...transactions,
  ]);

  return updatedProduct;
};

export const updateManyProductTranslations = async (
  translations: {
    productId?: string;
    languageCode: LanguageCode;
    translation: string;
    fieldName: ProductTranslationField;
  }[],
  prisma: PrismaClient | PrismaTransactionClient
) => {
  const transactions: PrismaPromise<unknown>[] = translations
    //TODO: ADD TS PLUGIN FROM MATT POCK TO UPDATE TYPE FOR AS STRING
    .filter(({ translation }) => translation)
    .map((record) => {
      return prisma.productI18N.upsert({
        where: {
          productId_languageCode_fieldName: {
            languageCode: record.languageCode,
            fieldName: record.fieldName,
            productId: record.productId as string,
          },
        },
        update: {
          translation: record.translation,
        },
        create: {
          languageCode: record.languageCode,
          fieldName: record.fieldName,
          productId: record.productId as string,
          translation: record.translation,
        },
      });
    });

  if ("$transaction" in prisma) {
    await prisma.$transaction([...transactions]);
    return;
  } else {
    return await Promise.all(transactions);
  }
};

export const deleteProduct = async (
  where: Prisma.ProductWhereUniqueInput,
  prisma: PrismaClient
) => {
  return await prisma.product.delete({
    where,
  });
};
