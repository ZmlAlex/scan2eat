import type {
  CategoryI18N,
  CategoryTranslationField,
  LanguageCode,
  Prisma,
  PrismaClient,
  PrismaPromise,
} from "@prisma/client";

import { formatFieldsToTranslationTable } from "~/server/helpers/formatFieldsToTranslationTable";

import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../schemas/category.schema";
import type { PrismaTransactionClient } from "./types";

export const createCategory = async (
  input: CreateCategoryInput,
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

  return await prisma.category.create({
    data: {
      menuId: input.menuId,
      categoryI18N: {
        createMany: { data: [...translations, ...additionalTranslations] },
      },
    },
  });
};

//TODO: USE IT FOR LANGUAGES
export const updateCategory = async (
  input: UpdateCategoryInput,
  prisma: PrismaClient
) => {
  // const translationFields: CategoryTranslationField[] = ["name"];

  const translations = formatFieldsToTranslationTable<CategoryTranslationField>(
    ["name"],
    input
  );

  const transactions: PrismaPromise<unknown>[] = translations
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

export const updateManyCategoryTranslations = async (
  translations: {
    categoryId?: string;
    languageCode: LanguageCode;
    translation: string;
    fieldName: CategoryTranslationField;
  }[],
  prisma: PrismaClient | PrismaTransactionClient
) => {
  const transactions: PrismaPromise<unknown>[] = translations
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

  if ("$transaction" in prisma) {
    await prisma.$transaction([...transactions]);
    return;
  } else {
    return await Promise.all(transactions);
  }
};

export const deleteCategory = async (
  where: Prisma.CategoryWhereUniqueInput,
  prisma: PrismaClient
) => {
  return await prisma.category.delete({
    where,
  });
};
