import type {
  CategoryI18N,
  CategoryTranslationField,
  LanguageCode,
  Prisma,
  PrismaClient,
  PrismaPromise,
} from "@prisma/client";

import type {
  CreateCategoryInput,
  UpdateCategoriesPositionInput,
  UpdateCategoryInput,
} from "~/server/api/category/category.schema";
import { formatFieldsToTranslationTable } from "~/server/helpers/formatFieldsToTranslationTable";

export const createCategory = async (
  input: CreateCategoryInput & { userId: string },
  additionalTranslations: Pick<
    CategoryI18N,
    "fieldName" | "languageCode" | "translation"
  >[],
  prisma: PrismaClient
) => {
  const translations = formatFieldsToTranslationTable<CategoryTranslationField>(
    ["name"],
    input
  );

  const { position: biggestPosition } =
    (await prisma.category.findFirst({
      where: { restaurantId: input.restaurantId },
      select: { position: true },
      orderBy: { position: "desc" },
    })) ?? {};

  const nextPosition = biggestPosition ? biggestPosition + 1 : 0;

  return await prisma.category.create({
    data: {
      userId: input.userId,
      restaurantId: input.restaurantId,
      position: nextPosition,
      categoryI18N: {
        createMany: { data: [...translations, ...additionalTranslations] },
      },
    },
  });
};

export const updateCategory = async (
  input: Omit<UpdateCategoryInput, "autoTranslateEnabled"> & { userId: string },
  additionalTranslations: Pick<
    CategoryI18N,
    "fieldName" | "languageCode" | "translation"
  >[],
  prisma: PrismaClient
) => {
  const translations = formatFieldsToTranslationTable<CategoryTranslationField>(
    ["name"],
    input
  );

  const transactions: PrismaPromise<unknown>[] = [
    ...translations,
    ...additionalTranslations,
  ]
    .filter(({ translation }) => translation)
    .map((record) =>
      prisma.categoryI18N.upsert({
        where: {
          categoryId_languageCode_fieldName: {
            categoryId: input.categoryId,
            languageCode: record.languageCode,
            fieldName: record.fieldName,
          },
        },
        update: {
          translation: record.translation,
        },
        create: {
          translation: record.translation,
          categoryId: input.categoryId,
          languageCode: record.languageCode,
          fieldName: record.fieldName,
        },
      })
    );

  await prisma.$transaction(transactions);
};

export const updateManyCategoriesTranslations = (
  translations: {
    categoryId?: string;
    languageCode: LanguageCode;
    translation: string;
    fieldName: CategoryTranslationField;
  }[],
  prisma: PrismaClient
) => {
  const transactions = translations
    .filter(({ translation }) => translation)
    .map((record) => {
      return prisma.categoryI18N.upsert({
        where: {
          categoryId_languageCode_fieldName: {
            categoryId: record.categoryId as string,
            languageCode: record.languageCode,
            fieldName: record.fieldName,
          },
        },
        update: {
          translation: record.translation,
        },
        create: {
          translation: record.translation,
          categoryId: record.categoryId as string,
          languageCode: record.languageCode,
          fieldName: record.fieldName,
        },
      });
    });

  return transactions;
};

export const updateManyCategoriesPositions = async (
  input: UpdateCategoriesPositionInput,
  userId: string,
  prisma: PrismaClient
) => {
  return prisma.$transaction(
    input.map((item) =>
      prisma.category.update({
        data: { position: item.position },
        where: { id: item.id, userId },
      })
    )
  );
};

export const deleteCategory = async (
  where: Prisma.CategoryWhereUniqueInput,
  prisma: PrismaClient
) => {
  return await prisma.category.delete({
    where,
  });
};